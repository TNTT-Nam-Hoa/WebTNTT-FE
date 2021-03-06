import { Pipe, PipeTransform } from '@angular/core';
import { appConst } from './constance';

@Pipe({ name: 'newline' })
export class NewlinePipe implements PipeTransform {
  transform(value: string, args: string[]): any {
    return value.replace(/(?:\r\n|\r|\n)/g, '<br />');
  }
}

@Pipe({
  name: 'xepHang'
})
export class XepHang implements PipeTransform {

  transform(value: any, args?: any): any {
    const _tmp = appConst.find(el => el.loai_du_lieu === 'XEP_HANG' && el.ky_hieu === value);
    if (_tmp) {
      return _tmp.ten
    }
    return value;
  }
}

@Pipe({
  name: 'xepLoai'
})
export class XepLoai implements PipeTransform {

  transform(value: any, args?: string): any {
    if (value === 'GIOI' && args === 'ChuyenCan') {
      value = 'TOT';
    }
    const _tmp = appConst.find(el => el.loai_du_lieu === 'XEP_LOAI' && el.ky_hieu === value);
    if (_tmp) {
      return _tmp.ten
    }
    return value;
  }
}

@Pipe({
  name: 'loaiTK'
})
export class LoaiTK implements PipeTransform {

  transform(value: any, args?: any): any {
    const _tmp = appConst.find(el => el.loai_du_lieu === 'LOAI_TAI_KHOAN' && el.ky_hieu === value);
    if (_tmp) {
      return _tmp.ten
    }
    return value;
  }
}

@Pipe({
  name: 'trangThai'
})
export class TrangThai implements PipeTransform {

  transform(value: any, args?: any): any {
    const _tmp = appConst.find(el => el.loai_du_lieu === 'TRANG_THAI' && el.ky_hieu === value);
    if (_tmp) {
      return _tmp.ten
    }
    return value;
  }
}

@Pipe({
  name: 'nganh'
})
export class Nganh implements PipeTransform {

  transform(value: any, args?: any): any {
    const _tmp = appConst.find(el => el.loai_du_lieu === 'NGANH' && el.ky_hieu === value);
    if (_tmp) {
      return _tmp.ten
    }
    return value;
  }
}

@Pipe({
  name: 'cap'
})
export class Cap implements PipeTransform {

  transform(value: any, args?: any): any {
    const _tmp = appConst.find(el => el.loai_du_lieu === 'CAP' && el.ky_hieu === value);
    if (_tmp) {
      return _tmp.ten
    }
    return value;
  }
}

@Pipe({
  name: 'doi'
})
export class Doi implements PipeTransform {

  transform(value: any, args?: any): any {
    const _tmp = appConst.find(el => el.loai_du_lieu === 'DOI' && el.ky_hieu === value);
    if (_tmp) {
      return _tmp.ten
    }
    return value;
  }
}

@Pipe({
  name: 'gioiTinh'
})
export class GioiTinh implements PipeTransform {

  transform(value: any, args?: any): any {
    return value === 'NAM' ? 'Nam' : 'N???';
  }
}

@Pipe({
  name: 'phieu'
})
export class Phieu implements PipeTransform {

  transform(value: any, args?: any): any {
    const _tmp = appConst.find(el => el.loai_du_lieu === 'PHIEU' && el.ky_hieu === value);
    if (_tmp) {
      return _tmp.ten
    }
    return value;
  }
}

@Pipe({
  name: 'ngay'
})
export class HienThiNgay implements PipeTransform {

  transform(value: any, args?: any): any {
    return ngay(value);
  }
}

export function ngay(value) {
  if (value === '0000-00-00') {
    return null;
  }
  if (value) {
    return value.replace(/(.+)[-|\/](.+)[-|\/](.+)/i, '$3-$2-$1');
  }
  return value;
}

@Pipe({
  name: 'objectKeys'
})
export class ObjectKeysPipe implements PipeTransform {

  transform(value, args: string[]): any {
    const keys = [];
    for (const key in value) {
      if (value[key]) {
        keys.push({ key: key, val: value[key] });
      }
    }
    return keys;
  }
}
