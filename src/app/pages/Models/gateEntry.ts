export class gateEntryDto
{
    gateEntry : gateEntry;
    gateEntryMaterials  : gateEntryMaterial [] = [];
    UserId : string;
    Status : string;
}


export class gateEntry{
    Id : number;
    GateEntryNo : number;
    Plant : string;
    GateEntryDate : Date | string | null;
    GateEntryTime : string;
    PurchasingDocument : number;
    PurchasingDocumentDate : Date | string | null;
    ReceivedDate : Date | string | null;
    InvoiceNo : string;
    InvoiceDate : Date | string | null;
    VendorCode : string;
    VendorName : string;
    VehicleNo : string;
    LRNo : string;
    CostCenter : string;
    Remarks : string;
    LocalOrImport : string;
    External : string;
}

export class gateEntryMaterial
{
    Id : number;
    PartsNo : string;
    Item : number;
    Description : string;
    Value : string;
    PoQty : string;
    OpenGrQty : string;
    SecurityQty : string;
    PackNo : string;
}