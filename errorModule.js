/**
 * @Name errorModule.js
 * @description Error Logging Module
 * @NModuleScope Public
 * @NApiVersion 2.1
 * @author Catalina R
 */
define(["N/error"], (error) => {

    const handlers = {}
    handlers.handleError = (message) =>{

            let errorObj = error.create({
            name: 'CUSTOM_ERROR_CODE',
            message: message,
        });

            log.error("Error: " + errorObj.name,  errorObj.message);
            throw errorObj;
    }

    return handlers;


});