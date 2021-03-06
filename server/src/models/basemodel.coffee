utils = require('../common/utils')
console = require 'console'
AppError = require('../common/apperror').AppError

class BaseModel

    constructor: (params) ->
        utils.extend(this, params)
        meta = @constructor._getMeta()
        if @_id
            @_id = meta.type._database.ObjectId(@_id)


           
    @get: (params, context, cb) ->
        meta = @_getMeta()
        @_database.findOne meta.collection, params, (err, result) =>
            cb err, if result then new meta.type(result)



    @getAll: (params, context, cb) ->
        meta = @_getMeta()
        @_database.find meta.collection, params, (err, cursor) =>
            cursor.toArray (err, items) =>
                cb err, if items?.length then (new meta.type(item) for item in items) else []


    
    @find: (params, fnCursor, context, cb) ->
        meta = @_getMeta()
        @_database.find meta.collection, params, (err, cursor) =>
            fnCursor cursor
            cursor.toArray (err, items) =>
                cb err, if items?.length then (new meta.type(item) for item in items) else []    



    @getCursor: (params, context, cb) ->
        meta = @_getMeta()
        @_database.find meta.collection, params, cb


           
    @getById: (id, context, cb) ->
        meta = @_getMeta()
        @_database.findOne meta.collection, { _id: @_database.ObjectId(id) }, (err, result) =>
            cb err, if result then new meta.type(result)
            
            
            
    @destroyAll: (params, cb) ->
        meta = @_getMeta()
        if meta.validateMultiRecordOperationParams(params)
            @_database.remove meta.collection, params, (err) =>
                cb?(err)
        else
            cb? new AppError "Call to destroyAll() must pass safety checks on params.", "SAFETY_CHECK_FAILED_IN_DESTROYALL"
            
            
            
    @_getMeta: ->
        meta = @_meta
        meta.validateMultiRecordOperationParams ?= (params) -> 
            false
        meta
        

    
    save: (context, cb) =>
        meta = @constructor._getMeta()

        validation = @validate()
        if validation.isValid

            fnSave = =>
                @_updateTimestamp = Date.now()
                           
                if not @_id?
                    if meta.logging?.isLogged
                        event = {}
                        event.type = meta.logging.onInsert
                        event.data = this
                        meta.type._database.insert 'events', event, =>
                    meta.type._database.insert meta.collection, @, (err, r) =>
                        cb? err, r
                else
                    meta.type._database.update meta.collection, { _id: @_id }, @, (err, r) =>
                        cb? err, @
        
            if @_id and meta.concurrency is 'optimistic'
                @constructor.getById @_id, context, (err, newPost) =>
                    if newPost._updateTimestamp is @_updateTimestamp
                        fnSave()
                    else
                        cb? new AppError "Update timestamp mismatch. Was #{newPost._updateTimestamp} in saved, #{@_updateTimestamp} in new.", 'OPTIMISTIC_CONCURRENCY_FAIL'
            else
                fnSave()        
        else
            console.log "Validation failed for object with id #{@_id} in collection #{meta.collection}."
            console.log JSON.stringify @
            for error in validation.errors
                console.log error
            cb? new AppError "Model failed validation."


    
    validate: =>
        { isValid: true }
        
    
    
    destroy: (context, cb) =>
        meta = @constructor._getMeta()
        meta.type._database.remove meta.collection, { _id: @_id }, (err) =>
            cb? err, @

    
    
    summarize: (fields) =>
        result = {}
        
        if fields
            for field in fields
                result[field] = this[field]

        result



exports.BaseModel = BaseModel

