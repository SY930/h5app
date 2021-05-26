import { Modal } from 'antd';
import fetch from 'isomorphic-fetch';

export const throttle = (fn, delay, mustRunDelay) => {
    let timer = null;
    let start;
    return () => {
      const context = this;
      const current = +new Date();
      clearTimeout(timer);
      if (!start) {
        start = current;
      }
      if (current - start >= mustRunDelay) {
        fn.apply(context);
        start = current;
      } else {
        timer = setTimeout(() => {
          fn.apply(context);
        }, delay);
      }
    };
  };
  

function getBodyParam(type, params) {
    if (type === 'JSON') return JSON.stringify(params);
    if (type === 'FORM') {
        const formData = new FormData();
        Object.keys(params).forEach(key => {
            formData.append(key, params[key]);
        });
        return formData;
    }
    return getQueryParam(params);
}

function getQueryParam(params) {
    const  p = Object.keys(params).map(key => {
        const val = params[key];
        if (Object.prototype.toString.call(val).indexOf('String') !== -1) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(val);
        }
        return encodeURIComponent(key) + '=' + encodeURIComponent(JSON.stringify(val));
    }).join('&');
    return p;
}
function getUrlParams(options) {
    const { url, method, type, ...params} = options;
    const _m = method.toUpperCase();
    const _t = type.toUpperCase();
    const getContentType = (type) => {
        let contentType = 'application/x-www-form-urlencoded;charset=UTF-8';
        if (type === 'JSON') contentType = 'application/json;charset=UTF-8';
        if (type === 'FORM') contentType = '';
        return contentType ? { 'content-type': contentType } : {};
    };
    const _u = _m === 'GET' ? (`${url}?${getQueryParam(params)}`) : url;
    const body = _m === 'POST' ? { body: getBodyParam(_t, params) } : {}
    const headers = { ...getContentType(_t) }; // token
    return { url: _u, method: _m,  headers, ...body,}
}

const fetchData = (url, options = {}) => {
    // let [options, setOptions] = useState({
    //     method: "POST",
    //     type: 'JSON',
    // });
    const opt = {
        method: 'POST', type: 'JSON',
        url,
        ...options,
    }
    const getData = () => new Promise((resolve, reject) => {
        const {url, ...options} = getUrlParams({...opt});
        fetch(url, options)
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    let err = new Error(response.statusText);
                    err.response = response;
                    throw error;
                }
            })
            .then(result => {
                console.log('result: ', result);
                if (result.code === '000') {
                    resolve(result.data);
                } else {
                    Modal.error({
                        title: '啊哦！好像有问题呦~~',
                        content: `${result.msg}`,
                    });
                }
            })
            .catch((error) => {
                console.log('error: ', error);
                reject(error)
            });
    })
    // useEffect(getData, [url]);
    return getData();
}

export {
    fetchData
} 