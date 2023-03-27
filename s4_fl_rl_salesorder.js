/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */
 const errorModule = "SuiteScripts/-n_Amazon/errorModule.js"
 const searchs = "SuiteScripts/-n_Amazon/SearchModule.js"
 define(['N/search', 'N/record', 'N/https', 'N/runtime', errorModule,searchs], function (search, record, https, runtime, errorM,searchM) {
 
     const handlers = {}
 
 
     handlers.get = (context) => {
         
         let response = {}
         try {
             
             response = searchM.busquedas(context,"salesorder")
 
         } catch (error) {
             log.error("error", error.message)
             response.code = 500;
             response.success = false;
             response.error.push(error.message);
         } finally {
             return JSON.stringify(response)
         }
     }
 
     handlers.post = (context) => {
 
         const response = { code: 400, success: false, data: [], error: []}
         let boolean = true
         try {
             const data = context.data;
             log.debug('Creando Orden de Venta', context)
             const salesOrder = record.create({
                 type: record.Type.SALES_ORDER,
             })
             Number.isInteger(data.name) ? "" : errorM.handleError("!!Ha ingresado un Tipo de dato erroneo para el campo de cliente, se debe ingresar el ID del cliente")
             //const s4_fl_rl_customer = `https://tstdrv2719149.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=154&deploy=2&id=${context.data.name}`
             let responseCustomer = {}
             let params = {
                 "id": data.name
             }
             responseCustomer = searchM.busquedas(params,"customer")
             if(responseCustomer.code === 500){
                 response.code = responseCustomer.code
                 response.success = responseCustomer.success
                 response.error.push(responseCustomer.error)
                 boolean = false
             } else {
                 salesOrder.setValue({
                     fieldId: 'entity',
                     value: data.name
                 })
                 boolean = false
             }
             
             for (let i = 0; i < data.items.length; i++) {
                 Number.isInteger(data.items[i].item) ? "" : errorM.handleError("!!Ha ingresado un Tipo de dato erroneo para el campo de item, se debe ingresar el ID del item")
                 let responseItem = {}
                 params = {
                     "id": data.items[i].item
                 }
                 responseItem = searchM.busquedas(params,"item")
                 if(responseItem.code === 500){
                     response.code = responseItem.code
                     response.success = responseItem.success
                     response.error.push(responseItem.error)
                     boolean = false
                 } else {
                     salesOrder.setSublistValue({
                         sublistId: 'item',
                         fieldId: 'item',
                         line: i,
                         value: data.items[i].item
                     })
                 }
                 Number.isInteger(data.items[i].quantity) ? "" : errorM.handleError("!!Ha ingresado un Tipo de dato erroneo para el campo de cantidad, se debe ingresar un numero")
                 salesOrder.setSublistValue({
                     sublistId: 'item',
                     fieldId: 'quantity',
                     line: i,
                     value: data.items[i].quantity
                 })
             }
             Number.isInteger(data.location) ? "" : errorM.handleError("!!!Ha ingresado un Tipo de dato erroneo para el campo de ubicacion, se debe ingresar el ID de la ubicacion")
             salesOrder.setValue({
                 fieldId: 'location',
                 value: data.location
             })
             if(boolean === true){
                 const salesOrderId = salesOrder.save()
                 response.code = 200
                 response.success = true;
                 response.message = 'Se creo la orden de venta correctamente'
             }
             
             
             //errorM.handleError("No se pudo crear la orden de venta") 
         } catch (error) {
             log.error("error", error.message)
             response.code = 500;
             response.success = false;
             response.error.push(error.message);
         } finally {
             return JSON.stringify(response)
         }
 
     }
 
     handlers.put = (context) => {
 
     }
 
     handlers.delete = (context) => {
 
     }
 
     return handlers
 })