import{D as n,S as t}from"./index-PTCwmdX1.js";class r{constructor(){this.supportCascades=!0}loadCubeData(s,i,m,e){const o=i.getEngine();let a,l=!1,d=1e3;if(Array.isArray(s))for(let p=0;p<s.length;p++){const h=s[p];a=n.GetDDSInfo(h),i.width=a.width,i.height=a.height,l=(a.isRGB||a.isLuminance||a.mipmapCount>1)&&i.generateMipMaps,o._unpackFlipY(a.isCompressed),n.UploadDDSLevels(o,i,h,a,l,6,-1,p),!a.isFourCC&&a.mipmapCount===1?o.generateMipMapsForCubemap(i):d=a.mipmapCount-1}else{const p=s;a=n.GetDDSInfo(p),i.width=a.width,i.height=a.height,m&&(a.sphericalPolynomial=new t),l=(a.isRGB||a.isLuminance||a.mipmapCount>1)&&i.generateMipMaps,o._unpackFlipY(a.isCompressed),n.UploadDDSLevels(o,i,p,a,l,6),!a.isFourCC&&a.mipmapCount===1?o.generateMipMapsForCubemap(i,!1):d=a.mipmapCount-1}o._setCubeMapTextureParams(i,l,d),i.isReady=!0,i.onLoadedObservable.notifyObservers(i),i.onLoadedObservable.clear(),e&&e({isDDS:!0,width:i.width,info:a,data:s,texture:i})}loadData(s,i,m){const e=n.GetDDSInfo(s),o=(e.isRGB||e.isLuminance||e.mipmapCount>1)&&i.generateMipMaps&&Math.max(e.width,e.height)>>e.mipmapCount-1===1;m(e.width,e.height,o,e.isFourCC,()=>{n.UploadDDSLevels(i.getEngine(),i,s,e,o,1)})}}export{r as _DDSTextureLoader};
