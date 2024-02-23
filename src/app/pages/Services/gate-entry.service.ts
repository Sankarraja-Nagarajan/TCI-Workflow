import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class GateEntryService {

  constructor(private _httpService : HttpService) { }

  getDetailsByPo(poNumber) : Observable<any>
  {
    const URL = `GateEntry/GetDetailsByPo?poNumber=${poNumber}`;
    return this._httpService.get(URL);
  }

  getMaterialDetails(poNumber) : Observable<any>
  {
    const URL = `GateEntry/GetMaterialDetails?poNumber=${poNumber}`;
    return this._httpService.get(URL);
  }

  getGateEnrtyNo() : Observable<any>
  {
    const URL = 'GateEntry/GetGateEntryNo';
    return this._httpService.get(URL);
  }

  saveGateEntry(formData) : Promise<any>
  {
    const URL = `GateEntry/SaveGateEntry`;
    return this._httpService.postFile(URL, formData).toPromise();
  }

  saveUploadDocument(formdata) : Promise<any>
  {
    const URL = `GateEntry/SaveUploadDocument`;
    return this._httpService.postFile(URL, formdata).toPromise();
  }

  GetApprovalDocument(gateEntryNo) : Observable<any>
  {
    const URL = `GateEntry/GetApprovalDocument?gateEntryNo=${gateEntryNo}`;
    return this._httpService.get(URL);
  }

  getGateEntryDetails(role, userId) : Observable<any>
  {
    const URL = `GateEntry/getGateEntryDetails?role=${role}&userId=${userId}`;
    return this._httpService.get(URL);
  }

  getApproveUserDetails(gateEntryNo) : Observable<any>
  {
    const URL = `GateEntry/GetApproveUserDetails?gateEntryNo=${gateEntryNo}`;
    return this._httpService.get(URL);
  }

  getGateEntryApprove(gateEntryNo) : Observable<any>
  {
    const URL = `GateEntry/GetEntryToApproval?gateEntryNo=${gateEntryNo}`
    return this._httpService.get(URL);
  }

  downloadExcel(gateEntryNo) : Observable<any>
  {
    const URL = 'GateEntry/DownloadApprovedGateEntry';
    return this._httpService.post(URL, gateEntryNo);
  }

  approvePO(gateEntryNo, userId) : Observable<any>
  {
    const URL = `GateEntry/ApprovePO?gateEntryNo=${gateEntryNo}&userId=${userId}`;
    return this._httpService.put(URL, gateEntryNo);
  }

  rejectGateEntry(gateEntryNo, userId, reason, comments) : Observable<any>
  {
    const URL = `GateEntry/rejectGateEntry?gateEntryNo=${gateEntryNo}&userId=${userId}&reason=${reason}&comments=${comments}`;
    return this._httpService.get(URL);
  }

}
