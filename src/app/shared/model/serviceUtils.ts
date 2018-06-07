import { AngularFireAction, AngularFireList, AngularFireObject, DatabaseSnapshot } from 'angularfire2/database';
import { Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

export class ServiceUtils {
  public static snapshotToObjectFn:
    OperatorFunction<AngularFireAction<DatabaseSnapshot<any>>[], any[]> =
    map(items =>
      items.map(item => ({ $key: item.key, ...item.payload.val() }))
    );

  static snapshotListToObjects(list: AngularFireList<any>): Observable<any[]> {
    return list.snapshotChanges().pipe(ServiceUtils.snapshotToObjectFn);
  }

  static snapshotToObject(obj: AngularFireObject<{}>): Observable<any> {
    return obj.snapshotChanges().pipe(map(item =>
      ({ $key: item.key, ...item.payload.val() })
    ));
  }
}
