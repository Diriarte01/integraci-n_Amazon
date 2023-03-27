/**
 * @Name searchmodule.js
 * @author Andres
 * @description Searchs Module
 * @NApiVersion 2.1
 * @NModuleScope Public
 */
define(['N/search',errorModule], function (search, errorM) {

    const handlers = {}

    handlers.busquedas = (context, typeSearch) => {
        const response = { code: 400, success: false, data: [], error: []}
        let filters
        let columns
        let type
        let exist = false;
        try {
            switch (typeSearch) {
                case 'customer':

                    const customer = context.id
                    filters = []
                    if (customer) filters.push(["internalid", "anyof", customer])
                    type = "customer";
                    columns = [search.createColumn({ name: "internalid", label: "Internal ID" })]
                    columns.push(search.createColumn({ name: "email", label: "Email" }))
                    columns.push(search.createColumn({ name: "phone", label: "Phone" }))
                    columns.push(search.createColumn({ name: "address", label: "Address" }))

                    var customerSearchObj = search.create({
                        type: type,
                        filters: filters,
                        columns: columns
                    });
                    
                    customerSearchObj.run().each(rs => {
                        exist = true;
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
                    if(!exist){
                        response.code = 404;
                        response.success = true;
                        errorM.handleError("!!!El cliente no existe")
                    }
                    break;
                case 'salesorder':
                    type = "salesorder";
                    columns = [search.createColumn({ name: "internalid", label: "ID interno" })]
                    columns.push(search.createColumn({ name: "type", label: "Tipo" }))
                    columns.push(search.createColumn({ name: "tranid", label: "Número de documento" }))
                    columns.push(search.createColumn({ name: "entity", label: "Nombre" }))
                    columns.push(search.createColumn({ name: "salesrep", label: "Representante de ventas" }))
                    columns.push(search.createColumn({ name: "trandate", label: "Fecha" }))
                    columns.push(search.createColumn({ name: "asofdate", label: "Fecha de corte" }))
                    columns.push(search.createColumn({ name: "statusref", label: "Estado" }))
                    columns.push(search.createColumn({ name: "account", label: "Cuenta" }))
                    columns.push(search.createColumn({ name: "total", label: "Total" }))
                    columns.push(search.createColumn({ name: "subsidiary", label: "Subsidiaria" }))
                    columns.push(search.createColumn({ name: "shipaddress", label: "Dirección de envío" }))
                    filters = [["type", "anyof", "SalesOrd"]]
                    filters.push("AND", ["mainline", "is", "T"])
                    let salesOrderSearchObj = search.create({
                        type: type,
                        filters: filters,
                        columns: columns
                    })
                    salesOrderSearchObj.run().each(rs => {
                        const obj = new Object();
                        exist = true
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
                    if(!exist){
                        response.code = 404;
                        response.success = true;
                        errorM.handleError("!!!No se encontraron Ordenes de Venta")
                    }
                    break;
                case 'item':
                    item = context.id;
                    type = "item";
                    columns = [search.createColumn({ name: "itemid", sort: search.Sort.ASC, label: "Nombre" })]
                    columns.push(search.createColumn({ name: "salesdescription", label: "Descripción" }))
                    columns.push(search.createColumn({ name: "type", label: "Tipo" }))
                    columns.push(search.createColumn({ name: "baseprice", label: "Precio base" }))
                    columns.push(search.createColumn({ name: "quantityavailable", label: "Disponible" }))
                    filters = [["type", "anyof", "InvtPart", "NonInvtPart"]]
                    filters.push("AND", ["quantityavailable", "greaterthan", "0"])
                    if(item) {
                        filters.push("AND", ["internalid", "anyof", item])
                    }
                    let itemSearchObj = search.create({ type: type, filters: filters, columns: columns });
                    itemSearchObj.run().each(rs => {
                        exist = true; 
                        const obj = new Object();
                        obj.internalId = rs.id;
                        obj.itemId = rs.getValue("itemid")
                        obj.description = rs.getValue("salesdescription")
                        obj.type = rs.getValue("type")
                        obj.baseprice = rs.getValue("baseprice")
                        obj.quantityavailable = rs.getValue("quantityavailable")
                        response.data.push(obj);
                        response.code = 200;
                        response.success = true;
                        return true;
                    });
                    if(!exist){
                        response.code = 404;
                        response.success = true;
                        errorM.handleError("!!!El articulo no existe")
                    }
                    break;
            }
        } catch (error) {
            log.error("error", error.message)
            response.code = 500;
            response.success = false;
            response.error.push(error.message);
        } finally {
            return response
        }
    }

    return handlers

})