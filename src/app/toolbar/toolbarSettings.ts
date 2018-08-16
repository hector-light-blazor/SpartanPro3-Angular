export class toolBarSettings{
    SECTIONS ?: sections;

}

interface sections{
    TICKET?: secTicket,
    SUBDIVISION?: secSub,
    NRF?: secNRF,
    MAP?: secMap,
    SETTINGS?: secSet
}
interface secTicket{
    onoff?: boolean,
    DISPLAY?: propView,
    INSERT?: propInsert,
    RECORDS?:propRec,
    QUICKSEARCH?: propSearch,
    EDITS?: propEdit,
    TICKET_INSERT?: propTicketInsert,
    TICKET_VIEW?: propTicketView,
    FILTER?: propFilter
}



interface secSub{
     onoff?: boolean,
     DISPLAY?: propView
}

interface secNRF {
    onoff?: boolean,
    DISPLAY?: propDISNRF
    MANAGEMENT?: propMANGNRF
}

interface secMap{
     onoff?: boolean,
     DISPLAY?: propMap,
     TOOLS?: propMapTools
}

interface secSet{
     onoff?:   boolean,
     PROFILE?: propProfile,
     USER?:    propUser,
     TICKET?:  propTicket,
     TOOLBAR?: propToolBar,
     GIS?: propGIS, 
}

interface propMapTools {
    onoff?: boolean
    ids?: btnsMapTool
}
interface propDISNRF {
    onoff?: boolean
    ids?: btnNRFDis
}

interface propMANGNRF {
    onoff?: boolean
    ids?: btnNRFMan
}

interface btnNRFDis {
    DASHBOARD: boolean
}

interface btnNRFMan {
    UPLOAD?: boolean
    USERS?: boolean
    EXPORT?: boolean
}


interface propProfile{
    onoff?: boolean,
    UPDATE?: boolean

}
interface propUser {
    onoff?: boolean,
    INSERT?: boolean,
    UPDATE?: boolean
}

interface propTicket {
    onoff?: boolean,
    INSERT?: boolean,
    UPDATE?: boolean
}

interface propToolBar {
    onoff?:  boolean,
    INSERT?: boolean,
    UPDATE?: boolean
}

interface propGIS{
    onoff?: boolean,
    ROUTING?: boolean
}

interface propMap{
    onoff: boolean,
    ids: btnsMap
}


interface propView{
    onoff: boolean,
    ids: btnsView
}

interface propInsert{
    onoff: boolean,
    ids: btnsInsert
}

interface propRec{
    onoff:boolean,
    ids: btnsRec
}

interface propSearch{
    onoff: boolean,
    ids: btnsSearch
}
interface propEdit{
    onoff:boolean,
    ids:btnsEdit
}

interface propTicketInsert{
    onoff:boolean,
    ids: btnsTicketInsert
}

interface propTicketView{
    onoff:boolean,
    ids: btnsTicketView
}

interface propFilter{
    onoff:boolean,
    ids:btnsTicketFilter
}

interface btnsView{
    dash: boolean,
    calendar: boolean,
    arch: boolean,
    charts?: boolean
}

interface btnsInsert{
    nw: boolean
}

interface btnsRec{
    filter: boolean
}

interface btnsSearch{
    search: boolean
}

interface btnsEdit{
    SAVE_TRANSFER: boolean,
    DELETE:         boolean,
    ARCHIVE:        boolean
}

interface btnsTicketInsert{
    COMMENTS: boolean,
    ATTACHMENT: boolean
}

interface btnsTicketView{
    MAP: boolean,
    ATTACHMENT: boolean,
    LETTER?: boolean
}

interface btnsTicketFilter{
    DATE: boolean,
    DOWNLOAD: boolean,
    RESET: boolean
}

interface btnsMap{
    MAP: boolean
}

interface btnsMapTool {
    MEASURE?: boolean,
    IDENTIFY?: boolean,
    EDIT_RANGES?: boolean
}