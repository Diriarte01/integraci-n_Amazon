/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 *@author Catalina R
 */
define(["N/search", "N/record"], (search, record) => {

    const handlers = {}
    const searchSalesOrder = response => {
        const type = "salesorder";
        const filters = [["type", "anyof", "SalesOrd"]];
        filters.push("AND", ["fulfillingtransaction.status", "anyof", "ItemShip:B", "ItemShip:A", "ItemShip:C"])
        filters.push("AND", ["revrectemplate.name", "anyof", "@NONE@"])
        const columns = [search.createColumn({ name: "entity", label: "Nombre" })]
        columns.push(search.createColumn({ name: "statusref", join: "fulfillingTransaction" }))

        let salesOrderSearchObj = search.create({ type: type, filters: filters, columns: columns, });
        salesOrderSearchObj.run().each(res => {
            const obj = new Object();
            obj.internalId = res.id;
            obj.company = res.getText("entity");
            obj.status = res.getValue({
                name: "statusref",
                join: "fulfillingTransaction",
            })
            response.data.push(obj);
            response.code = 200;
            response.success = true;
            return true;
        });
    }
    const searchInvoice = objCreated => {
        const type = "invoice"
        const filters = [["type", "anyof", "CustInvc"]]
        filters.push("AND", ["createdfrom", "anyof", objCreated])
        filters.push("AND", ["mainline", "is", "T"])
        const columns = [search.createColumn({ name: "createdfrom", label: "Creado desde" })]
        columns.push(search.createColumn({ name: "statusref", label: "Estado" }))
        var invoiceSearchObj = search.create({ type: type, filters: filters, columns: columns });
        /*  
        !puede haber mas de 1 factura por orden de venta, validar
        */
        const alreadyExists = []
        invoiceSearchObj.run().each(result => {
            let ready = result.getValue("createdfrom")
            alreadyExists.push(ready);
            return true;
        });
        return alreadyExists
    }
    handlers.get = (context) => {
        const response = { code: 400, success: false, data: [], error: [] }
        try {
            searchSalesOrder(response)
        } catch (error) {
            log.error("error", error.message);
            response.code = 500;
            response.success = false;
            response.error.push(error.message);
        } finally {
            return JSON.stringify(response);
        }
    }

    handlers.post = (context) => {
        const response = { code: 400, success: false, data: [], error: [] }
        try {
            let res = JSON.parse(handlers.get(context));
            let data = res.data;
            let ss = []
            data.forEach(obj => {
                let alreadyExists = searchInvoice(obj.internalId)
                if (alreadyExists.length == 0) {
                    ss.push(obj.internalId);
                }
            });
            /* ... para que podamos acceder a los numeros, es como si quitaramos el [] */
            let unique = ss.reduce((prev, curr) => prev.indexOf(curr) === -1 ? [...prev, curr] : prev, []);
            unique.forEach(u => {
                u = Number(u)
                let load = record.load({
                    type: "salesorder",
                    id: u,
                    isDynamic: true,
                });
                let value = load.getValue("paymentmethod");
                if (value.length > 0) {
                    /* si tiene metodo de pago se crea la cashsale */
                    response.data.push("crea cashsale", u);
                } else {
                    let see = record.transform({
                        fromType: "salesorder",
                        fromId: u,
                        toType: "invoice",
                        isDynamic: true,
                    })
                    const x = see.save()
                    response.data.push("Factura de venta creada");
                }
            })
            response.code = 200;
            response.success = true;
        } catch (error) {
            log.error("error", error);
            response.code = 500;
            response.success = false;
            response.error.push(error.message);
        } finally {
            return JSON.stringify(response);
        }
    }

    return handlers;
});
