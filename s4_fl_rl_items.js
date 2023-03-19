/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */
define(["N/search"], (search) =>{

    const handlers = {}
    /* si ponemos _get nos da error ya que el espera un literal "get", sin el guion */
    handlers.get = (context) => {
        const response = { code: 400, success: false, data: [], error: [] }
        try {
            /* posiblemente se le agregue el nivel de precio */
            const type = "item";
            const columns = [search.createColumn({ name: "itemid", sort: search.Sort.ASC, label: "Nombre" })]
            columns.push(search.createColumn({ name: "salesdescription", label: "Descripción" }))
            columns.push(search.createColumn({ name: "type", label: "Tipo" }))
            columns.push(search.createColumn({ name: "baseprice", label: "Precio base" }))
            columns.push(search.createColumn({ name: "totalquantityonhand", label: "Cantidad física total" }))
            const filters = []
            var itemSearchObj = search.create({ type: type, filters: filters, columns: columns });
            itemSearchObj.run().each(rs => {
                const obj = new Object();
                obj.internalId = rs.id;
                obj.itemId = rs.getValue("itemid")
                obj.description = rs.getValue("salesdescription")
                obj.type = rs.getValue("type")
                obj.baseprice = rs.getValue("baseprice")
                obj.totalquantity = rs.getValue("totalquantityonhand")
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
        }finally{
            return JSON.stringify(response);
        }
    }


    return handlers
});
