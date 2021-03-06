import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Subject } from 'rxjs';

import { JwtAuthHttp } from '../../../../../services/http-auth.service';
import { environment } from 'environments/environment';
import { AppState } from '../../../../../store/reducers';
import { bodauTiengViet } from '../../../../../_helpers';
import { GetLopInfoSucc } from '../../../../../store/actions/lop-hoc.action';

@Component({
  selector: 'app-huynh-truong',
  templateUrl: './huynh-truong.component.html',
  styleUrls: ['./huynh-truong.component.scss']
})
export class HuynhTruongComponent implements OnDestroy {
  private tkAPI = environment.apiURL + '/tai-khoan';
  private lhAPI = environment.apiURL + '/lop-hoc';
  private taiKhoanSrcArr = [];

  @Output() updateInfo = new EventEmitter();

  lopHocID: number;
  khoaHienTaiID: any;
  isLoading: boolean;
  error: any;

  huynhTruongArr = [];
  taiKhoanArr = [];
  filter$ = new Subject<any>();

  pagingHT = {
    id: 'htTable',
    itemsPerPage: 10,
    currentPage: 1,
  }

  sub$: any;
  subKhoa$: any;
  subHt$: any;

  constructor(
    private activeRoute: ActivatedRoute,
    private store: Store<AppState>,
    private toasterService: ToasterService,
    private formBuilder: FormBuilder,
    private _http: JwtAuthHttp,
  ) {

    this.sub$ = this.activeRoute.parent.params.subscribe(params => {
      this.lopHocID = params['id'];
    });
    this.subKhoa$ = this.store.select((state: AppState) => state.auth.khoa_hoc_hien_tai).subscribe(_khoa => {
      this.khoaHienTaiID = _khoa.id;
      this.loadTaiKhoan();
    });

    this.subHt$ = this.store.select((state: AppState) => state.lop_hoc.huynh_truong).subscribe(res => {
      this.huynhTruongArr = res;
    });

    this.filter$.debounceTime(400).subscribe((_str) => {
      this.taiKhoanArr = this.taiKhoanSrcArr.filter(el => {
        const _tmpA = bodauTiengViet(el.ho_va_ten);
        const _tmpB = bodauTiengViet(_str);
        return _tmpA.toLowerCase().indexOf(_tmpB.toLowerCase()) !== -1
      });
    });
  }

  ngOnDestroy() {
    this.filter$.complete();
    this.sub$.unsubscribe();
    this.subKhoa$.unsubscribe();
    this.subHt$.unsubscribe();
  }

  private loadTaiKhoan() {
    const search = new URLSearchParams();
    search.set('chua_xep_lop', this.khoaHienTaiID);
    search.set('trang_thai', 'HOAT_DONG');
    search.set('loai_tai_khoan', 'HUYNH_TRUONG,SOEUR,LINH_MUC');
    this._http.get(this.tkAPI, { search }).map(res => res.json()).subscribe(res => {
      this.taiKhoanSrcArr = res.data;
      this.filter$.next(''); // Trigger Search
    }, error => {
      this.toasterService.pop('error', 'L???i!', error);
    })
  }

  them(_id = null) {
    this.isLoading = true;
    const _tmpArr = [];
    if (_id) {
      _tmpArr.push(_id);
    } else {
      this.taiKhoanArr.filter((_el) => {
        return _el.checked === true;
      }).forEach(_el => {
        _tmpArr.push(_el.id);
      });
    }

    this._http.post(this.lhAPI + '/' + this.lopHocID + '/thanh-vien', {
      id: _tmpArr
    }).map(res => res.json()).subscribe(_res => {
      this.loadTaiKhoan();
      this.toasterService.pop('success', '???? th??m!');
      this.store.dispatch(new GetLopInfoSucc(_res));
      this.isLoading = false;
    }, error => {
      this.toasterService.pop('error', 'L???i!', error);
      this.isLoading = false;
    })
  }

  xoa(_id = null) {
    this.isLoading = true;
    const _tmpArr = [];
    if (_id) {
      _tmpArr.push(_id);
    } else {
      this.huynhTruongArr.filter((_el) => {
        return _el.checked === true;
      }).forEach(_el => {
        _tmpArr.push(_el.id);
      });
    }

    this._http.post(this.lhAPI + '/' + this.lopHocID + '/thanh-vien/xoa', {
      id: _tmpArr
    }).map(res => res.json()).subscribe(_res => {
      this.loadTaiKhoan();
      this.toasterService.pop('success', '???? th??m!');
      this.store.dispatch(new GetLopInfoSucc(_res));
      this.isLoading = false;
    }, error => {
      this.toasterService.pop('error', 'L???i!', error);
      this.isLoading = false;
    })
  }

  checkAll(_arr: any[], _event) {
    _arr.forEach(_el => {
      _el.checked = _event.target.checked
    });
  }

  getChecked(_arr: any[]) {
    return _arr.filter((_el) => {
      return _el.checked === true;
    }).length;
  }

  cancel() {
    this.updateInfo.emit(null);
  }
}
