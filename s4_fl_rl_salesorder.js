/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */
define(['N/search','N/record'], function (search,record) {

    const handlers = {}


    handlers.get = (context) => {

        const response = { code: 400, success: false, data: [], error: [], message: '' }
        try {
            
            const type = "salesorder";
            const columns = [search.createColumn({ name: "internalid", label: "ID interno" })]
            columns.push(search.createColumn({ name: "type", label: "Tipo" }))
            columns.push(search.createColumn({ name: "tranid", label: "Número de documento" }))
            columns.push(search.createColumn({ name: "entity", label: "Nombre" }))
            columns.push(search.createColumn({ name: "salesrep", label: "Representante de ventas" }))
            columns.push(search.createColumn({name: "trandate", label: "Fecha"}))
            columns.push(search.createColumn({name: "asofdate", label: "Fecha de corte"}))
            columns.push(search.createColumn({name: "statusref", label: "Estado"}))
            columns.push(search.createColumn({ name: "account", label: "Cuenta" }))
            columns.push(search.createColumn({ name: "total", label: "Total" }))
            columns.push(search.createColumn({ name: "subsidiary", label: "Subsidiaria" }))
            columns.push(search.createColumn({ name: "shipaddress", label: "Dirección de envío" }))
            const filters = [["type", "anyof", "SalesOrd"]]
            filters.push("AND", ["mainline", "is", "T"])
            let salesOrderSearchObj = search.create({
                type: type,
                filters: filters,
                columns: columns
            })
            salesOrderSearchObj.run().each(rs => {
                const obj = new Object();
                obj.internalId = rs.id;
                obj.type = rs.getValue("type");
                obj.tranid = rs.getValue("tranid");
                obj.entity = rs.getValue("entity");
                obj.salesrep = rs.getValue("salesrep");
                obj.trandate = rs.getValue("trandate");
                obj.asofdate = rs.getValue("asofdate");
                obj.statusref = rs.getValue("statusref");
                obj.account = rs.getValue("account");
                obj.total = rs.getValue("total");
                obj.subsidiary = rs.getValue("subsidiary");
                obj.shipaddress = rs.getValue("shipaddress");
                response.data.push(obj);
                response.code = 200;
                response.success = true;
                return true;
            })
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
            const data = context.data;
            log.debug('Creando Orden de Venta', data)

            const salesOrder = record.create({
                type: record.Type.SALES_ORDER,
            })
            salesOrder.setValue({
                fieldId: 'entity',
                value: data.name
            })
            salesOrder.setSublistValue({   
                sublistId: 'item',
                fieldId: 'item',
                line: 0,
                value: data.item
            })
            salesOrder.setSublistValue({
                sublistId: 'item',
                fieldId: 'quantity',
                line: 0,
                value: data.quantity
            })
            salesOrder.setValue({
                fieldId:'location',
                value: data.location
            })

            const salesOrderId = salesOrder.save()
            response.data.push({
                internalId: salesOrderId,
                typerecord: record.Type.SALES_ORDER
            })
            response.code = 200
            response.success = true;
            response.message = 'Se creo la orden de venta correctamente'


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
