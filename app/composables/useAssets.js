export default function useAssets(name) {
    const assets = import.meta.glob('/assets/images/*.jpg', {eager: true});
  
    const getAssetUrl = () => {
     if (assets[name]) {
       return assets[name].default
     }
    }
  
    return getAssetUrl()
  }