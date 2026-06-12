// Re-export da kv-store.ts per compatibilità con il codice esistente
export { 
  getAlbumsFromKV, 
  saveAlbumsToKV, 
  addAlbumToKV, 
  deleteAlbumFromKV,
  setKVStore,
  type WorkerEnv 
} from "./kv-store";
