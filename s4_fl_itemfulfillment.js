/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */
define(['N/search', 'N/record'], function (search, record) {

    const response = { code: 400, success: false, message: "", data: [], error: [] }

    function _get(context) {
        try {
            log.debug('context', context)

            const itemFullfilment = context.id
            log.debug('context id', itemFullfilment)
            const filters = [["mainline", "is", "T"]]
            filters.push("AND", ["type", "anyof", "ItemShip"])
            filters.push("AND", ["status", "anyof", "ItemShip:B"])

            //Si se introduce un id en los parámetros del GET, se agrega este filtro extra 
            if (itemFullfilment) {
                filters.push("AND", ["internalid", "anyof", itemFullfilment])
            }

            const itemfulfillmentSearchObj = search.create({
                type: "itemfulfillment",
                filters: filters,
                columns:
                    [
                        search.createColumn({ name: "entity", label: "Customer" }),
                        search.createColumn({ name: "statusref", label: "Status" }),
                        //search.createColumn({ name: "custbody_s4_fl__received_check", label: "Received by the customer" })
                    ]
            });

            itemfulfillmentSearchObj.run().each(function (result) {
                log.debug('result', result)
                
                /* Aquí organizamos los datos obtenidos en la búsqueda dentro de un objeto 
                que será mostrado en panatalla al momento de ejecutar el GET */
                let obj = new Object();
                obj.id = result.id;
                obj["Customer"] = result.getText("entity");
                obj["Status"] = result.getValue("statusref");
                //obj["Received by the customer"] = result.getValue("custbody_s4_fl__received_check");
                log.debug('obj', obj)

                response.data.push(obj); //Mandamos a Amazon los valores obtenidos de la búsqueda

                return true;
            });
            response.message = "The following orders are packed and ready to be picked up by Amazon"
            response.code = 200 //Este código significa OK
            response.success = true

        }

        catch (e) {
            response.code = 500
            response.error.push(e.message)
            response.success = false
        }
        finally {
            return JSON.stringify(response);
        }


    }


    function _put(context) {


        try {
            log.debug('Initializing updating shipstatus', context); //Un mensaje de consola para comprobar si entra la función al enviar el PUT
            const data = context.data
            log.debug('data', data)

            //Cargamos el record correspondiente al id introducido por Amazon
            let updateStatus = record.load({
                type: "itemfulfillment",
                id: data.id,
                isDynamic: false
            })


            /* Aquí tomamos los valores ingresados en el PUT para que sean consumidos por NS */
            if (data["Status"] == "shipped") {
                updateStatus.setValue({
                    fieldId: "shipstatus",
                    value: "C" // C es el valor de "enviado" para NS
                })
            }

            if (data["Status"] == "packed") {
                updateStatus.setValue({
                    fieldId: "shipstatus",
                    value: "B" // B es el valor de "packed" para NS
                })
            }

            updateStatus.setValue({
                fieldId: "custbody_s4_fl__received_check",
                value: data["Received by the customer"] //it can be true or false
            })


            /*  Aquí abajo llamamos al objeto updateStatus que almacenó los valores de los campos 
            y guardamos los cambios realizados al ItemFulfillment con el método .save */
            const saveItemFulfillment = updateStatus.save()

            response.data.push({ //Con el método push mandamos lo que quedó guardado en la variable saveItemFulfillment
                id: saveItemFulfillment,
                updated: data
            })
            response.message = "The item fulfillment status has been successfully updated"
            response.code = 202 //Este código significa Accepted
            response.success = true

        }

        catch (e) {
            response.code = 500
            response.error.push(e.message)
            response.success = false
        }

        finally {
            return JSON.stringify(response);
        }


    }



    return {
        get: _get,

        put: _put,
    }
});
