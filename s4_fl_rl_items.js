/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 *@author Catalina R
 */
const errorModule = "SuiteScripts/-n_Amazon/errorModule.js"
const integrationLog = "SuiteScripts/-n_Amazon/s4_sns_api_log.js"
define(['N/search', integrationLog, errorModule], (search, integration, errorModule) => {
    const handlers = {}
    /* si ponemos _get nos da error ya que el espera un literal "get", sin el guion */
    handlers.get = (context) => {
        const response = { code: 400, success: false, data: [], error: [] }
        try {
            const item = context.id;
            const type = "item";
            
            const columns = [search.createColumn({ name: "itemid", sort: search.Sort.ASC, label: "Nombre" })]
            columns.push(search.createColumn({ name: "salesdescription", label: "Descripción" }))
            columns.push(search.createColumn({ name: "type", label: "Tipo" }))
            columns.push(search.createColumn({ name: "baseprice", label: "Precio base" }))
            columns.push(search.createColumn({ name: "quantityavailable", label: "Disponible" }))
            const filters = [["type", "anyof", "InvtPart", "NonInvtPart"]]
            filters.push("AND", ["quantityavailable", "greaterthan", "0"])
            if(item) {
                filters.push("AND", ["internalid", "anyof", item])
            }
            let existSearch = false;
            var itemSearchObj = search.create({ type: type, filters: filters, columns: columns });
            itemSearchObj.run().each(rs => {
                existSearch = true; 
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
            existSearch ? "": errorModule.handleError("No se encontraron articulos en su busqueda")
            let x = integration.handleRequest("GET", response, item);

        } catch (error) {
            log.error("error", error.message)
            response.code = 500;
            response.success = false;
            response.error.push(error.message);
        } finally {
            return JSON.stringify(response);
        }
    }
    return handlers
});
