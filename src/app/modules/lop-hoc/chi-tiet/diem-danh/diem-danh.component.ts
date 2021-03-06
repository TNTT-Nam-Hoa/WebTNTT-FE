import { ToasterService } from 'angular2-toaster';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { URLSearchParams } from '@angular/http';

import { JwtAuthHttp } from '../../../../services/http-auth.service';
import { environment } from 'environments/environment';
import { AppState } from '../../../../store/reducers';
import { ngay } from '../../../shared/utities.pipe';

@Component({
  selector: 'app-diem-danh',
  templateUrl: './diem-danh.component.html',
  styleUrls: ['./diem-danh.component.scss']
})
export class DiemDanhComponent implements OnDestroy {
  private lhAPI = environment.apiURL + '/lop-hoc';

  tab = 'thong-tin'
  isLoading = true;

  pagingTN = {
    id: 'tnTable',
    itemsPerPage: 10,
    currentPage: 1,
  }

  maskOption = {
    mask: [/[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/],
    guide: true,
  }

  lopHocID: number;
  ngayHoc: string;

  curAuth: any;
  thieuNhiArr = [];
  apiData: {
    data: any[],
    sunday: null,
  };

  sub$: any;
  subAuth$: any;
  subTn$: any;

  constructor(
    private activeRoute: ActivatedRoute,
    private store: Store<AppState>,
    private toasterService: ToasterService,
    private _http: JwtAuthHttp,
  ) {
    this.ngayHoc = ngay(new Date().toJSON().slice(0, 10));

    this.sub$ = this.activeRoute.parent.params.subscribe(params => {
      this.lopHocID = params['id'];
    });
    this.subAuth$ = this.store.select((state: AppState) => state.auth).subscribe(res => {
      this.curAuth = res;
    });
    this.subTn$ = this.store.select((state: AppState) => state.lop_hoc.thieu_nhi).subscribe(res => {
      this.thieuNhiArr = res;
      if (this.thieuNhiArr.length) {
        this.loadData();
      }
    });
  }

  ngOnDestroy() {
    this.sub$.unsubscribe();
    this.subAuth$.unsubscribe();
    this.subTn$.unsubscribe();
  }

  loadData() {
    const search = new URLSearchParams();
    search.set('ngay_hoc', ngay(this.ngayHoc));

    this.isLoading = true;
    this.apiData = null;
    this._http.get(this.lhAPI + '/' + this.lopHocID + '/chuyen-can', { search })
      .map(res => res.json()).subscribe(_res => {
        this.apiData = _res;
        this.isLoading = false;
      }, error => {
        this.toasterService.pop('error', 'L???i!', error);
        this.isLoading = false;
      })
  }

  /**
   * T??m ????? li???u cho h???c vi??n
   * @param tn H???c Vi??n
   */
  findChuyenCan(tn) {
    let res;
    if (this.apiData) {
      res = this.apiData.data.find(c => c.tai_khoan_id === tn.id);
      if (res) {
        return res;
      }
    }
    return res ? res : {};
  }

  /**
   * Ki???m tra quy???n ??i???m danh
   * + T??i kho???n ???????c ph??n quy???n 'diem-danh'
   * ho???c
   * + Ch??? ???????c ??i???m danh l???p c???a m??nh
   *   v??
   *   H???n ??i???m danh c??n hi???u l???c trong ph???n c???u h??nh Kh??a H???c
   */
  hasPerm() {
    if (this.curAuth.phan_quyen.includes('diem-danh')) {
      return true;
    }

    if (this.curAuth.lop_hoc_hien_tai_id.toString() === this.lopHocID.toString() && this.apiData) {
      const eventStartTime = new Date(this.apiData.sunday);
      const eventEndTime = new Date(new Date().toJSON().slice(0, 10));
      const duration = (eventEndTime.valueOf() - eventStartTime.valueOf()) / (60 * 60 * 24 * 1000);
      if (duration < this.curAuth.khoa_hoc_hien_tai.ngung_diem_danh) {
        return true;
      }
    }

    return false;
  }

  update(_info) {
    this.tab = 'thong-tin';
    if (_info) {
      this.loadData();
    }
  }
}
