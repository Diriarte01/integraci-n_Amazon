/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 *@author Catalina R
 */
define(["N/search"], search => {

    const handlers = {}

    handlers.get = (context) => {
        const response = { code: 400, success: false, data: [], error: [] }
        try {
            const type = "itemfulfillment";
            const filters = [["type", "anyof", "ItemShip"]];
            filters.push("AND", ["createdfrom", "anyof", "176"])
            filters.push("AND", ["mainline", "is", "T"])
            const columns = [search.createColumn({ name: "statusref", label: "Estado" })]
            columns.push(search.createColumn({ name: "entity", label: "Nombre" }))
            columns.push(search.createColumn({ name: "trandate", label: "Fecha" }))
            columns.push(search.createColumn({name: "createdfrom", label: "Creado desde"}))
            let itemfulfillmentSearchObj = search.create({ type: type, filters: filters, columns: columns, });
            itemfulfillmentSearchObj.run().each(res => {
                log.debug("Entra")
                const obj = new Object();
                obj.internalId = res.id;
                obj.name = res.getValue("entity");
                obj.createdFrom = res.getValue("createdfrom");
                obj.trandate = res.getValue("trandate")
                obj.status = res.getValue("statusref")
                response.data.push(obj);
                response.code = 200;
                response.success = true;
                return true;
            });
            // log.debug("search", itemfulfillmentSearchObj)
        } catch (error) {
            log.error("error", error.message);
            response.code = 500;
            response.success = false;
            response.error.push(error.message);
        }finally{
            return JSON.stringify(response);
        }
    }

    // handlers.post = (context) => {

    // }

    // // handlers.put=(context) =>{

    // // }

    // // handlers.delete=(context) =>{

    // // }

    return handlers;
});
