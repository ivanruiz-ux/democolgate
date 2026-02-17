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
                    LinePrinter: "PRN_A1",
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
                BackupPrinter: "PRN_A2",
                PartialPallet: false,
                QtyPerPallet: 75,
                Comment: ""               

            }

            const oModel = new JSONModel(oData);
            this.getView().setModel(oModel);
        },
        statusStateFormatter: function (bValue) {
            return bValue ? "Success" : "Error";
        },
    });
});