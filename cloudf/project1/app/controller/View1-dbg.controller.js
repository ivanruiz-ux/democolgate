sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("project1.controller.View1", {
        onInit() {
        const oData = {
                MaterialNumber: "61034399",
                MaterialDescription: "SUAVITEL CMPL 46F CS SP MORNING SUN",
                PackingInfo: "75 CS = 1 PAL",

                Catalogs: {
                                ProductionLines: [
                                    { key: "HCLinea_A", text: "HC Línea A" },
                                    { key: "HCLinea_B", text: "HC Línea B" },
                                    { key: "HCLinea_C", text: "HC Línea C" }
                                ],

                                Printers: [
                                    { key: "PRN_A1", text: "Printer A1" },
                                    { key: "PRN_A2", text: "Printer A2" },
                                    { key: "PRN_B1", text: "Printer B1" }
                                ],

                                BatchList: [
                                    { key: "5316MX111A", text: "5316MX111A" },
                                    { key: "5316MX222A", text: "5316MX222A" },
                                    { key: "5316MX333A", text: "5316MX333A" }
                                ]
                            },
                Filters: {
                        ProductionLine: "HCLinea_A",
                        LinePrinter: "HCLinea_A",
                        PrinterEnabled: true,
                        OrderNumber: "108785909",
                        BatchList: "5316MX111A"
                        },
                HUCount: 26,
                TotalCases: 1950,

                HUs: [
                    {
                        HU: "175095467401692471",
                        HuCreatedMill: true,
                        HuCreatedSap: true,
                        GrInSap: false,
                        Batch: "5316MX111A",
                        Shift: "2",
                        MaterialNumber: "61034399",
                        Amount: 75,
                        CreatedOn: "Nov 12 2025 04:29:38 PM"
                    },
                    {
                        HU: "175095467401692488",
                        HuCreatedMill: true,
                        HuCreatedSap: true,
                        GrInSap: true,
                        Batch: "5316MX111A",
                        Shift: "2",
                        MaterialNumber: "61034399",
                        Amount: 75,
                        CreatedOn: "Nov 12 2025 04:45:25 PM"
                    },
                    {
                        HU: "175095467401692495",
                        HuCreatedMill: true,
                        HuCreatedSap: true,
                        GrInSap: false,
                        Batch: "5316MX111A",
                        Shift: "2",
                        MaterialNumber: "61034399",
                        Amount: 75,
                        CreatedOn: "Nov 12 2025 04:16:06 PM"
                    }
                    // agrega más si quieres
                ],
                BackupPrinter: "PRN_A1",
                    PartialPallet: false,
                    QtyPerPallet: 75,
                    Comment: ""
                }
            const oModel = new JSONModel(oData);
            this.getView().setModel(oModel);
            this.loadPrinters();
            this.loadWorksCenter();
            this.onGetHu();
            this.loadPrinters();
            this.loadWorkCenters();
        },
        onGetHu: async function () {
            const oView = this.getView();
            const oModel = oView.getModel();

            var oOrderIn = this.getView().byId("_IDGenInput1");
            var sOrder = oOrderIn.getValue();
            //const sOrder = oModel.getProperty("/Filters/OrderNumber"); 
            if (!sOrder) {
                console.log("Falta valor de orden")
                return;
            }

            const sPayloadXml =
                `<ROOT>
                <select>
                    <ORDEN>${this._escapeXml(sOrder)}</ORDEN>
                </select>
                </ROOT>`;

            try {
                const res = await fetch("/api/selecthu", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/xml; charset=utf-8",
                        "Accept": "application/xml"
                    },
                    body: sPayloadXml
                });

                if (!res.ok) {
                    const txt = await res.text();
                    console.error("Error body:", txt);
                    throw new Error(`HTTP ${res.status}: ${txt}`);
                }

                console.log("res: ", res);

                const sXml = await res.text();
                const aHUs = this._parseSelectHuResponse(sXml);

                // Aquí enlazas a tu tabla
                oModel.setProperty("/HUs", aHUs);
                oModel.setProperty("/HUCount", aHUs.length);

                // total (ej. suma de AMOUNT)
                const iTotalCases = aHUs.reduce((sum, hu) => sum + (parseInt(hu.Amount, 10) || 0), 0);
                oModel.setProperty("/TotalCases", iTotalCases);

            } catch (e) {
                console.error("loadGetHu error:", e);
            }
        },
        _escapeXml: function (s) {
            return String(s)
                .replaceAll("&", "&amp;")
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll('"', "&quot;")
                .replaceAll("'", "&apos;");
        },
        _parseSelectHuResponse: function (sXml) {
            const oDoc = new DOMParser().parseFromString(sXml, "application/xml");

            const oParseError = oDoc.getElementsByTagName("parsererror")[0];
            if (oParseError) {
                throw new Error("Respuesta XML inválida");
            }

            const aRows = Array.from(oDoc.getElementsByTagName("row"));

            return aRows.map((row) => ({
                HU: this._getText(row, "HU"),

                // Estados (tu XML manda 1/0)
                HuCreatedMill: this._getText(row, "HUMII"),
                HuCreatedSap: this._getText(row, "HUSAP"),
                GrInSap: this._getText(row, "GRSAP"),

                // Campos para la tabla
                Batch: this._getText(row, "BATCH"),
                Shift: this._getText(row, "SHITF"),
                MaterialNumber: this._getText(row, "MATERIAL"),
                Amount: this._getText(row, "AMOUNT"),
                CreatedOn: this._getText(row, "DATE"),

                // Extras por si los ocupas después
                OrderNumber: this._getText(row, "ORDEN"),
                ProductionLine: this._getText(row, "PUESTO_TRABAJO")
            }));
        },

        _getText: function (oRowNode, sTag) {
            const el = oRowNode.getElementsByTagName(sTag)[0];
            return el ? (el.textContent || "").trim() : "";
        },
        statusColorFormatter: function (v) {
            if (v === "" || v === null || v === undefined) return "#e9730c"; // amarillo
            const b = (v === "1" || v === 1 || v === true);
            return b ? "#107e3e" : "#bb0000";
        },
        loadPrinters: async function () {
            try {
                const res = await fetch("/api/selectprinter", {
                    method: "POST",
                    headers: { "Content-Type": "application/xml", "Accept": "application/xml" },
                    body: "<ROOT/>"
                });

                if (!res.ok) throw new Error(await res.text());
                const xmlText = await res.text();

                console.log("xmlText",xmlText)

                

            } catch (e) {
                console.error("loadPrinters error:", e);
            }
        },
        loadWorksCenter: async function () {
            try {
                const res = await fetch("/api/selectpuesto_trabajo", {
                    method: "POST",
                    headers: { "Content-Type": "application/xml", "Accept": "application/xml" },
                    body: "<ROOT/>"
                });

                if (!res.ok) throw new Error(await res.text());
                const xmlText = await res.text();

                console.log("xmlText",xmlText)

                

            } catch (e) {
                console.error("loadPrinters error:", e);
            }
        },
        loadPrinters: async function () {
            try {
                const res = await fetch("/api/selectprinter", {
                    method: "POST",
                    headers: { "Content-Type": "application/xml", "Accept": "application/xml" },
                    body: "<ROOT/>"
                });

                if (!res.ok) throw new Error(await res.text());
                const xmlText = await res.text();

                console.log("xmlText",xmlText)
                const parser = new DOMParser();

                const xmlres = parser.parseFromString(xmlText, "text/xml");
                console.log("xmlres",xmlres)

                const rowNodes = Array.from(xmlres.getElementsByTagName("row"));

                const aRows = rowNodes.map(node => ({
                key: node.getElementsByTagName("PRINTER")[0]?.textContent?.trim() || "",
                text: node.getElementsByTagName("DESCRIPCION")[0]?.textContent?.trim() || ""
                }));

                console.log("aRows:", aRows);

                const oModel = this.getView().getModel();
                oModel.setProperty("/Catalogs/Printers", aRows);

            } catch (e) {
                console.error("loadPrinters error:", e);
            }
        },
        loadWorkCenters: async function () {
            try {
                const res = await fetch("/api/selectpuesto_trabajo", {
                    method: "POST",
                    headers: { "Content-Type": "application/xml", "Accept": "application/xml" },
                    body: "<ROOT/>"
                });

                if (!res.ok) throw new Error(await res.text());
                const xmlText = await res.text();

                const parser = new DOMParser();

                const xmlres = parser.parseFromString(xmlText, "text/xml");
                console.log("xmlres",xmlres)

                const rowNodes = Array.from(xmlres.getElementsByTagName("row"));

                const aRows = rowNodes.map(node => ({
                key: node.getElementsByTagName("PUESTO_TRABAJO")[0]?.textContent?.trim() || "",
                text: node.getElementsByTagName("DESC")[0]?.textContent?.trim() || ""
                }));

                console.log("aRows:", aRows);

                const oModel = this.getView().getModel();
                oModel.setProperty("/Catalogs/ProductionLines", aRows);

            } catch (e) {
                console.error("loadWorkCenters error:", e);
            }
        },
        onRefresh: function () {
            this.onGetHu();
        },
       
        statusStateFormatter: function (bValue) {
            return bValue ? "Success" : "Error";
        },
    });
});