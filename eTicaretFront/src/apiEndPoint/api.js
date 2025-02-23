import axios from "axios"

const BASE_URL = import.meta.env.VITE_BASE_URL
const REGISTER_URL = import.meta.env.VITE_REGISTER_URL
const LOGIN_URL = import.meta.env.VITE_LOGIN_URL
const TOKEN_VERIFY = import.meta.env.VITE_TOKEN_VERIFY
const REFRESH_TOKEN = import.meta.env.VITE_REFRESH_TOKEN
const USER_URL = import.meta.env.VITE_USER_URL
const PRODUCT_URL = import.meta.env.VITE_PRODUCT_URL
const SEPET_URL = import.meta.env.VITE_SEPET_URL
const YORUM_URL = import.meta.env.VITE_YORUM_URL
const PUAN_URL = import.meta.env.VITE_PUAN_URL
const CATEGORY_URL = import.meta.env.VITE_CATEGORY_URL
const FAVORI_URL = import.meta.env.VITE_FAVORI_URL
const MAGAZA_URL = import.meta.env.VITE_MAGAZA_URL



// kullancı kayıt olma isteği
export const register = async (userName, userEmail, userPassword) => {
    try {
        const response = await axios.post(REGISTER_URL,
            { username: userName, email: userEmail, password: userPassword }
        )
        if (response.status == 201) {
            return { status: 201 }
        } else {
            console.log("kayıt işlemi başarısız")
        }
    } catch (e) {
        return e.status
    }
}

// kullanıcı giriş yapma isteği
export const login = async (userName, userPassword) => {
    try {
        const response = await axios.post(LOGIN_URL,
            { email: userName, password: userPassword }
        )

        if (response.status == 200) {
            localStorage.setItem("token", response.data.access)
            localStorage.setItem("refresh", response.data.refresh)
            return { status: 200 }
        }
    } catch (e) {
        return e.status
    }
}

// kullanıcı tokeni doğralama isteği
export const successToken = async () => {
    const token = localStorage.getItem("token")
    if(token){
        try{
            const response = await axios.post(TOKEN_VERIFY,{token:token})
            return response
        }catch(e){
            return e.response
        }
    }
    return { status: 401 }
}

// refresh token doğrulama isteği
export const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refresh")
    if(!refreshToken){
        return false
    }

    try{
        const response = await axios.post(REFRESH_TOKEN,{refresh:refreshToken})
        localStorage.setItem("token",response.data.access)
        return true

    }catch(e){
        console.log("refresh token hatası", e.status)
        return false
    }
}

// Bütün ürünleri getiren istek
export const products = async () => {
    const response = await axios.get(PRODUCT_URL)
    return response
}

// user bilgileri getiren istek
export const getUser = async () => {
    const response = await axios.get(USER_URL,{
        headers:{
            Authorization: `PNCRYazilim ${localStorage.getItem("token")}`
        }
    })
    return response.data[0]
}

// ürün detay sayfası için ürün bilgileri getiren istek
export const urunDetayi = async (id) => {
    const response = await axios.get(`${PRODUCT_URL}${id}/`)
    return response.data
}

// beden bilgisini getiren istek
export const beden = async () => {
    const response = await axios.get(`${BASE_URL}beden/`)
    return response.data
}

// renk bilgisini getiren istek
export const renk = async () => {
    const response = await axios.get(`${BASE_URL}renk/`)
    return response.data
}

// ürünü sepete gönderen istek
export const addUrunSepet = async (sepetId,urunId,adet,renk,beden) => {
    const response = await axios.post(`${SEPET_URL}${sepetId}/add_urun/`,
        {urun_id : urunId, sepet:sepetId , adet: adet ,renk_id:renk, beden_id: beden},
        {
            headers:{
                Authorization: `PNCRYazilim ${localStorage.getItem("token")}`
            }
        }
    )
    return response.data
}

// kullanıcının active sepetini getiren istek
export const getSepet = async () => {
    const response = await axios.get(`${SEPET_URL}active/`,{
        headers:{
            Authorization : `PNCRYazilim ${localStorage.getItem("token")}`
        }
    })

    // console.log(response.data)
    return response.data
}

// sepetten tek ürünü silme isteği
export const tekUrunDelete = async (sepetId,urunId) => {
    const response = await axios.post(`${SEPET_URL}${sepetId}/remove_urun/`,
        {urun_id : urunId},
        {
            headers:{
                Authorization:`PNCRYazilim ${localStorage.getItem("token")}`
            }
        }
    )
    console.log("ürün silindi")
}

// ürün adeti güncelleme isteği 
export const urunAdetUpdate = async(urunId,adet,sepetId) => {
    const response = await axios.post(`${SEPET_URL}${sepetId}/update_urun/`,
        {urun_id: urunId, adet:adet},
        {
            headers:{
                Authorization: `PNCRYazilim ${localStorage.getItem("token")}`
            }
        }
    )
}

// sepetteki tüm ürünleri silen istek
export const sepetAllClear = async (sepetId) => {
    const response = await axios.post(`${SEPET_URL}${sepetId}/sepet_clear/`,
        {},
        {
            headers:{
                Authorization: `PNCRYazilim ${localStorage.getItem("token")}`
            }
        }
    )
}


//  mağazanın ürün ekleme işlemleri , magaza açma kapama 


// kullanıcnın sepetini onaylayan istek
export const sepetiTamamla = async () => {
    const response = await axios.post(`${SEPET_URL}complate/`,
        {},
        {
            headers:{
                Authorization: `PNCRYazilim ${localStorage.getItem("token")}`
            }
        }
     )
     return response
}

// kullanıcının tamamlanmış siparişlerini getiren istek
export const eskiSepet = async () => {
    const response = await axios.get(`${SEPET_URL}tamamlanmis_sepetler/`,{
        headers:{
            Authorization: `PNCRYazilim ${localStorage.getItem("token")}`
        }
    })
    // console.log("eskiSepet", response.data)
    return response.data
}

// ürünün yorumlarını getiren istek
export const yorum = async (id) => {
    const response = await axios.get(`${YORUM_URL}urun_yorumlari/?urun_id=${id}`)
    return response.data
}

// urune kullanıcı yorumunu gönderen istek
export const yorumGönder = async (userId,urunId,yorum) => {
    const response = await axios.post(`${YORUM_URL}`,
        {owner:userId, urun:urunId, uYorum:yorum},
        {
            headers:{
                Authorization: `PNCRYazilim ${localStorage.getItem("token")}`
            }
        }
    )
}

// urunu satın almıs mı kontrolu 
export const urunuAlmisMi = async (urunId) => {
    const response = await axios.get(`${YORUM_URL}kullanici_urunleri/?urun_id=${urunId}`,{
        headers:{Authorization: `PNCRYazilim ${localStorage.getItem("token")}`}
    })
    console.log(response.data.aldi)
    return response.data.aldi
}

// ürünün puanlarını getiren istek
export const puan = async (urunId) => {
    const response = await axios.get(`${PUAN_URL}urun_ortalama_puan/?urun_id=${urunId}`)
    // console.log(response.data.ortalama_puan)
    return response.data.ortalama_puan
}

// kullanıcının urun puanını gönderen istek
export const puanGönder = async (urunId,userId,puan) => {
    const response = await axios.post(`${PUAN_URL}`,
        {owner: userId, urun: urunId, uPuan:puan},
        {
            headers:{Authorization: `PNCRYazilim ${localStorage.getItem("token")}`}
        }
    )
}

// tüm kategorileri getiren istek
export const category = async () => {
    const response = await axios.get(`${CATEGORY_URL}`)
    return response.data
}

//kategoriye göre (sluga göre) ürünleri getiren istek
export const kategoriSlug = async (slug) => {
    const response = await axios.get(`${PRODUCT_URL}kategori/${slug}/`)
    return response.data
}

//favoriye ürün ekleyip çıkaran istek
export const toggleFavori = async (urunId,renkId = null ,bedenId = null) => {
    const response = await axios.post(`${FAVORI_URL}toggle_favori/`,
        {urun_id:urunId, renk_id: renkId , beden_id: bedenId},
        {
            headers:{Authorization: `PNCRYazilim ${localStorage.getItem("token")}`}
        }
    )

    console.log(response)
    return response.data.eklendi
}

// userın favorilerini getiren istek
export const favoriList = async () => {
    const response = await axios.get(`${FAVORI_URL}`,{
        headers:{Authorization: `PNCRYazilim ${localStorage.getItem("token")}`}
    })
    return response.data
}

//magaza olusturan istek
export const magzaOlusturApi = async (magzaBilgisi) => {
    const response = await axios.post(`${MAGAZA_URL}`,
        magzaBilgisi,
        {headers:{Authorization: `PNCRYazilim ${localStorage.getItem("token")}`}}
    )
}

// kişini magazalarını getiren istek
export const magzaGetir = async () => {
    const response = await axios.get(`${MAGAZA_URL}benim_magazalarim/`,
        {
            headers:{
                Authorization: `PNCRYazilim ${localStorage.getItem("token")}`
            }
        }
    )
    return response.data
}

// magaza bilgisini güncelleyen istek
export const magazaGuncelle = async (magza,mId) => {
    const response = await axios.patch(`${MAGAZA_URL}${mId}/guncelle/`,
        magza,
        {
            headers:{Authorization: `PNCRYazilim ${localStorage.getItem("token")}`}
        }
    )

}

//magaza detayını getiren istek
export const magazaDetayi = async (mId) => {
    const response = await axios.get(`${MAGAZA_URL}${mId}/detay/`,
        {headers:{Authorization:`PNCRYazilim ${localStorage.getItem("token")}`}}
    )
    // console.log(response.data)
    return response.data
}

// urun bilgileri gönderen istek
export const magazayaUrunEkle = async (urunDatasi) => {
    const response = axios.post(`${PRODUCT_URL}`,
        urunDatasi,
        {
            headers:{
                'Content-Type':'multipart/form-data',
                Authorization: `PNCRYazilim ${localStorage.getItem("token")}`
            }
        }
    )
}

//magazaya ait ürünleri getiren istek
export const magazaUrunleriGetir = async (mId) => {
    const response = await axios.get(`${PRODUCT_URL}magza_urunleri/?magza_id=${mId}`,{
        headers:{
            Authorization: `PNCRYazilim ${localStorage.getItem("token")}`
        }
    })
    return response.data
}

// magazanın urun guncelleme ısteği
export const magazaUrunGuncelle = async (id,urun) => {
    console.log("***",urun)
    console.log("///",id)
    const response = await axios.put(`${PRODUCT_URL}${id}/`,
        urun,
        {
            headers:{
                'Content-Type':'multipart/form-data',
                Authorization: `PNCRYazilim ${localStorage.getItem("token")}`
            }
        }
    )
}

//magazanın urunu sılme ısteği
export const magazayaUrunSil = async(urunId) => {
    const response = await axios.delete(`${PRODUCT_URL}${urunId}/`,
        {
            headers:{
                Authorization: `PNCRYazilim ${localStorage.getItem("token")}`
            }
        }
    )
}

//magazayı silme isteği
export const magazayiSil = async (mId) => {
    const response = await axios.delete(`${MAGAZA_URL}${mId}/`,
        {
            headers:{Authorization: `PNCRYazilim ${localStorage.getItem("token")}`}
        }
    )
}