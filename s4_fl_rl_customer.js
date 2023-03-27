/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */
 const errorModule = "SuiteScripts/-n_Amazon/errorModule.js"
 const searchs = "SuiteScripts/-n_Amazon/SearchModule.js"
define(["N/search", 'N/record',searchs,errorModule], (search, record,searchM,errorM) => {

    const handlers = {}
    handlers.get = (context) => {

       let response = {}

        try {
            
            response = searchM.busquedas(context,"customer")

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
        const response = { code: 400, success: false, data: [], error: [], message: '' }

        try {
            log.debug('Creando cliente', context)
            const data = context.data;
            let recordObj = record.create({
                type: 'customer',
                isDinamyc: false,
            })
            recordObj.setValue({
                fieldId: 'entityid',
                value: data.name
            })
            if (data.isperson == "T") {
                recordObj.setValue({
                    fieldId: 'firstname',
                    value: data.name
                })
                let parse = data.name.split(" ")
                recordObj.setValue({
                    fieldId: 'lastname',
                    value: parse[1]
                })

            }
            recordObj.setValue({
                fieldId: 'email',
                value: data.email
            })
            recordObj.setValue({
                fieldId: 'phone',
                value: data.phone
            })
            recordObj.setValue({
                fieldId: 'companyname',
                value: data.company
            })
            recordObj.setValue({
                fieldId: 'subsidiary',
                value: data.subsidiary
            })
            recordObj.setValue({
                fieldId: 'defaultaddress',
                value: data.address
            })
            recordObj.setValue({
                fieldId: 'salesrep',
                value: data.salesrep
            })
            recordObj.setValue({
                fieldId: "isperson",
                value: data.isperson
            })
            const saveRecord = recordObj.save()

            response.data.push({
                internalId: saveRecord,
                typeRecord: 'customer'
            })

            response.code = 200
            response.success = true;
            response.message = 'Se creo el cliente correctamente'

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
        let response = {}
        let responsebusqueda = {}
        try {
            log.debug('Buscando Cliente', context)
            const data = context.data;
            responsebusqueda = searchM.busquedas(context,"customer")
            const obj = responsebusqueda.data
           
            if (responsebusqueda.code == 200) {
               
                let recordObj = record.load({
                    type: 'customer',
                    id: obj[0].internalId,

                })
                recordObj.setValue({
                    fieldId: 'entityid',
                    value: data.name
                })
                if (data.isperson == "T") {
                    recordObj.setValue({
                        fieldId: 'firstname',
                        value: data.name
                    })
                    let parse = data.name.split(" ")
                    recordObj.setValue({
                        fieldId: 'lastname',
                        value: parse[1]
                    })

                }
                recordObj.setValue({
                    fieldId: 'email',
                    value: data.email
                })
                recordObj.setValue({
                    fieldId: 'phone',
                    value: data.phone
                })
                recordObj.setValue({
                    fieldId: 'companyname',
                    value: data.company
                })
                recordObj.setValue({
                    fieldId: 'subsidiary',
                    value: data.subsidiary
                })
                recordObj.setValue({
                    fieldId: 'defaultaddress',
                    value: data.address
                })
                recordObj.setValue({
                    fieldId: 'salesrep',
                    value: data.salesrep
                })
                recordObj.setValue({
                    fieldId: "isperson",
                    value: data.isperson
                })
                recordObj.save();
                
                response = { code: 200, success: true, data: [data], error: [], message: 'Se edito el cliente correctamente' }
                log.debug('Entra', response)
                
            }else {
                response = responsebusqueda
            }
        } catch (error) {
            log.error("no se pudo editar el cliente", e.message)
            response.code = 500
            response.errors = e.message
            response.success = false
            response.errors.push(e.message);
        } finally {
            return JSON.stringify(response)
        }



    }



    handlers.delete = (context) => {

    }
    return handlers
});
