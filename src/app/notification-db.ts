export class NotificationDB {
  private static dbName = 'NotificationDB';
  private static storeName = 'Meta';

  static open(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(NotificationDB.dbName, 1);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(NotificationDB.storeName)) {
          db.createObjectStore(NotificationDB.storeName);
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  static async getCount(): Promise<number> {
    const db = await NotificationDB.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(NotificationDB.storeName, 'readonly');
      const store = tx.objectStore(NotificationDB.storeName);
      const request = store.get('notificationCount');

      request.onsuccess = () => resolve(request.result || 0);
      request.onerror = () => reject(request.error);
    });
  }

  static async setCount(count: number): Promise<void> {
    const db = await NotificationDB.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(NotificationDB.storeName, 'readwrite');
      const store = tx.objectStore(NotificationDB.storeName);
      const request = store.put(count, 'notificationCount');

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  static async clearCount(): Promise<void> {
    await NotificationDB.setCount(0);
  }
}
