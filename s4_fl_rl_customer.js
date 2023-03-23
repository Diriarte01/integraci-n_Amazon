/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */
define(["N/search", 'N/record'], (search, record) => {

    const handlers = {}
    handlers.get = (context) => {

        const response = { code: 400, success: false, data: [], error: [] }

        try {

            const filters = []
            const type = "customer";
            const columns = [search.createColumn({ name: "internalid", label: "Internal ID" })]
            columns.push(search.createColumn({ name: "email", label: "Email" }))
            columns.push(search.createColumn({ name: "phone", label: "Phone" }))
            columns.push(search.createColumn({ name: "address", label: "Address" }))

            var customerSearchObj = search.create({
                type: type,
                filters: filters,
                columns: columns
            });
            customerSearchObj.run().each(rs => {
                const obj = new Object();
                obj.internalId = rs.id;
                obj.name = rs.getValue("internalid");
                obj.email = rs.getValue("email");
                obj.phone = rs.getValue("phone");
                obj.address = rs.getValue("address");
                response.data.push(obj);
                response.code = 200;
                response.success = true;
                return true;
            });
        } catch (error) {
            log.error("error", error.message)
            response.code = 500;
            response.success = false;
            response.error.push(error.message);
        } finally {
            return JSON.stringify(response);
        }

    }

    handlers.post = (context) => {
        const response = { code: 400, success: false, data: [], error: [], message: '' }

        try {
            log.debug('Creando Contacto', context)
            const data = context.data;
            let recordObj = record.create({
                type: 'customer',
                isDinamyc: false,
            })
            recordObj.setValue({
                fieldId: 'entityid',
                value: data.name
            })
            if(data.isperson == "T"){
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
            return response
        }
    }

    handlers.put = (context) => {
        const response = {
            code: 400, success: false,
            data: [],
            errors: [],
            message: ''
        }
        const responseBusqueda = {
            code: 400, success: false,
            data: [],
            errors: []
        }

        try {
            log.debug('Buscando Cliente', context)
            const data = context.data;
            const type = 'customer';
            const filters = [["entityid", "is", data.name]];
            const columns = [search.createColumn({ name: "internalid", label: "Internal ID" })]
            columns.push(search.createColumn({ name: "email", label: "Email" }))
            columns.push(search.createColumn({ name: "phone", label: "Phone" }))
            columns.push(search.createColumn({ name: "address", label: "Address" }))
            const customerSearchObj = search.create({
                type: type,
                filters: filters,
                columns: columns,
            });
            customerSearchObj.run().each(function (rs) {
                let obj = new Object();
                obj.internalId = rs.id;
                obj.name = rs.getValue("internalid");
                responseBusqueda.data.push(obj)
                return true;
            });
            const obj = responseBusqueda.data
            if (customerSearchObj.runPaged().count == 1) {
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

                response.data.push(data)
                response.code = 200
                response.success = true;
                response.message = 'Se edito el cliente correctamente'
            } else {
                response.code = 400
                response.success = false
                response.errors.push('No se encontro el cliente')

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
