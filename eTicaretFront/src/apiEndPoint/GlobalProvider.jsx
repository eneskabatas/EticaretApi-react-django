import { createContext, useEffect, useReducer, useState } from "react";
import { addUrunSepet, beden, category, eskiSepet, favoriList, getSepet, getUser, kategoriSlug, login, magazaDetayi, magazaGuncelle, magazaUrunGuncelle, magazaUrunleriGetir, magazayaUrunEkle, magazayaUrunSil, magazayiSil, magzaGetir, magzaOlusturApi, products, puan, puanGönder, refreshToken, register, renk, sepetAllClear, sepetiTamamla, successToken, tekUrunDelete, toggleFavori, urunAdetUpdate, urunDetayi, urunuAlmisMi, yorum, yorumGönder } from "./api";


export const GlobalContext = createContext()

const defaultState = {
    items: [],
    totalAmount: 0
}

const reducer = (state, action) => {
    switch (action.type) {
        // ürünü sepete ekleyen case
        case "EKLE":

            const cartItemIndex = state.items.findIndex((sepetUrun) => {
                return sepetUrun.id === action.urun.id && sepetUrun.renk === action.renk && sepetUrun.beden === action.beden
            })

            let updateItems = [...state.items]

            if (cartItemIndex !== -1) {
                updateItems[cartItemIndex] = {
                    ...state.items[cartItemIndex],
                    amount:
                        state.items[cartItemIndex].amount + 1
                }
            } else {
                updateItems = [...state.items, { ...action.urun, amount: 1, renk: action.renk, beden: action.beden }]
            }

            const totalAmount = updateItems.reduce((acc, item) => acc + item.fiyat * item.amount, 0)

            const yeniEklenenUrun = updateItems.find(
                (urun) =>
                    urun.id === action.urun.id &&
                    urun.renk === action.renk &&
                    urun.beden === action.beden
            )

            if (yeniEklenenUrun) {
                addUrunSepet(action.sepetId, action.urun.id, yeniEklenenUrun.amount, action.renk, action.beden)
            }

            return {
                items: updateItems,
                totalAmount: totalAmount
            }

        case "REMOVE_URUN":

            const filteredUrun = state.items.filter((urun) => urun.sepetUrunId !== action.sepetUrunId)
            const removeUrun = state.items.find((urun) => urun.sepetUrunId === action.sepetUrunId)

            tekUrunDelete(action.sepetId, action.sepetUrunId)



            return {
                items: filteredUrun,
                totalAmount: state.totalAmount - removeUrun.fiyat * removeUrun.amount
            }

        case "INCREMENT":
            console.log(action.id)
            console.log(action.urun)
            console.log(action.amount + 1)

            const incrementItems = state.items.map((urun) =>
                urun.sepetUrunId === action.id &&
                    urun.renk === action.urun.renk &&
                    urun.beden === action.urun.beden
                    ? { ...urun, amount: urun.amount + 1 } : urun
            )
            urunAdetUpdate(action.id, action.amount + 1, action.sepetId)

            return {
                ...state,
                items: incrementItems,
                totalAmount: state.totalAmount + Number(state.items.find((urun) => urun.sepetUrunId === action.id).fiyat)
            }

        case "DECREMENT":
            const decrementItems = state.items.map((urun) => {
                if (urun.sepetUrunId === action.id && urun.amount > 1) {
                    return { ...urun, amount: urun.amount - 1 }
                } else {
                    return urun
                }
            })

            urunAdetUpdate(action.id, action.amount - 1, action.sepetId)

            return {
                ...state,
                items: decrementItems,
                totalAmount: decrementItems.reduce((acc, urun) => acc + urun.fiyat * urun.amount, 0)
            }

        case "CLEAR":

            sepetAllClear(action.sepetId)

            return {
                items: defaultState.items,
                totalAmount: defaultState.totalAmount
            }

        case "LOAD_SEPET":
            return {
                ...state,
                items: action.payload.items,
                totalAmount: action.payload.totalAmount,
                sepetId: action.payload.id
            }

        case "TAMAM_SEPET":
            return {
                items: defaultState.items,
                totalAmount: defaultState.totalAmount
            }
    }

}

const magzaDefaultState = {
    magaza: [],
    urunler: [],
}

const magzaReducer = (mState, action) => {
    switch (action.type) {
        case "MAGAZA_OLUSTUR":

            magzaOlusturApi(action.magzaBilgileri)

        case "MAGAZA_GETIR":


            

            return {
                ...mState,
                magaza: action.magaza
            }

        case "MAGAZA_GUNCELLE":

            magazaGuncelle(action.magzaBilgisi, action.mId)

        case "MAGAZA_URUN_GETIR":

            return{
                ...mState,
                urunler:action.urunler
            }

        default:
            return mState
    }
}


export const GlobalProvider = ({ children }) => {

    const [userName, setUserName] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const [userPassword, setUserPassword] = useState("")
    const [userPasswordTekrar, setUserPasswordTekrar] = useState("")
    const [validUser, setValidUser] = useState(false) // kullanıcı başarılı giriş yaptı mı?
    const [urunler, setUrunler] = useState([]) // bütün ürünleri tutan state
    const [onlineUser, setOnlineUser] = useState({}) //aktif olan user bilgileri
    const [detayUrun, setDetayUrun] = useState({}) // detay sayfasına göre ürün tutan state
    const [bedenler, setBedenler] = useState([]) // urunun bedenler bilgisini tutan state
    const [urunRenkleri, setUrunRenkleri] = useState([]) // urun renk bilgileri tutan state
    const [secilenRenk, setSecilenRenk] = useState()
    const [secilenBeden, setSecilenBeden] = useState()
    const [userSepet, setUserSepet] = useState({}) // kullanıcının aktif sepetini tutan state
    const [tamamlanmisSepetler, setTamamlanmisSepetler] = useState([]) // kullanıcının eski siparişlerini tutan state
    const [urunYorumlari, setUrunYorumlari] = useState([])// ürünün tüm yorumlarını tutan state
    const [kullaniciYorumu, setKullaniciYorumu] = useState("") // kullanıcının yorumunu tutan state
    const [yorumYapabilir, setYorumYapabilir] = useState() // satın aldıysa yorum yapabilir
    const [urunPuani, setUrunPuani] = useState("") // ürünün punanın tutan state 
    const [kullaniciPuani, setKullaniciPuani] = useState("") // kullanıcının ürüne verdiği puan
    const [kategoriler, setKategoriler] = useState([]) // tüm kategoriler
    const [kategoriDetay, setKategoriDetay] = useState([]) // kategoriye ait ürünleri tutan state
    const [favoriDurum, setFavoriDurum] = useState(false)
    const [favorilerim, setFavorilerim] = useState([]) // bütün favorileri tutan state
    const [magazaDetaylari, setMagazaDetaylari] = useState({})

    const [magzaBilgileri, setMagzaBilgileri] = useState({
        mAdi: "",
        mTelefon: "",
        mAdresIl: "",
        mAdresIlce: "",
        mAdres: "",
        mEmail: "",
        mLogo: null,
        mWebAdres: "",
        mVn: "",
        mVd: "",
        mBakiye: "0.00"
    })

    const [urunBilgileri,setUrunBilgileri] = useState({
        name: "",
        aciklama: "",
        fiyat: null,
        stok: null,
        image: null,
        category: null,
        magza: null,
        ebat: [],
        renk: []
    })

    const [cartState, dispatch] = useReducer(reducer, defaultState) // sepet işlemini yöneten reducer
    const [magzaState, magzaDispach] = useReducer(magzaReducer, magzaDefaultState)

    useEffect(() => {
        validateToken()
        
    }, [])

    useEffect(()=>{
        getProducts()
    },[])


    // register parametrelerini ileten fonksiyon
    const userRegister = async (userName, userEmail, userPassword) => {
        const response = await register(userName, userEmail, userPassword)
        if (response.status == 201) {
            console.log("kayıt başarılı")
            setUserEmail('')
            setUserName('')
            setUserPassword('')
            setUserPasswordTekrar('')
            window.location.pathname = "/login"
        } else {
            alert("kayıt işlemi başarısız aynı kullanıcı ismi ve email mevcut. başka isimle kayıt ol!")
        }
    }

    // userLogin parametrelerini ileten fonksiyon
    const userLogin = async (userName, userPassword) => {
        const response = await login(userName, userPassword)
        if (response.status == 200) {
            console.log("kullanıcı başarılı giriş yaptı")
            validateToken()
        }
        else {
            alert("kullanıcı girişi başarısız")
        }
    }

    // token geçerliliğini kontrol eden ve user kontrolu yapan fonksıyon
    const validateToken = async () => {
        const accessToken = await successToken()
        if (!accessToken) {
            // setOnlineUser(null)
            setValidUser(false)
            return;
        }

        try {
            const tokenIsValid = await refreshToken()
            console.log("token geçerli mi", tokenIsValid)
            setValidUser(tokenIsValid)
            if (tokenIsValid) {
                const userResponse = await getUser()
                setOnlineUser(userResponse)

                const sepetResponse = await getSepet()
                setUserSepet(sepetResponse)
                // console.log(sepetResponse)
                dispatch({
                    type: "LOAD_SEPET",
                    payload: {
                        id: sepetResponse.id,
                        items: sepetResponse.sepetUrunleri.map((urun) => ({
                            id: urun.urun.id,
                            name: urun.urun.name,
                            fiyat: urun.urun.fiyat,
                            image: urun.urun.image,
                            amount: urun.adet,
                            sepetUrunId: urun.id
                        })),
                        totalAmount: sepetResponse.sepetUrunleri.reduce(
                            (acc, item) => acc + item.urun.fiyat * item.adet, 0
                        )
                    }
                })

                const eskiSepetResponse = await eskiSepet()
                setTamamlanmisSepetler(eskiSepetResponse)

                const favoriResponse = await favoriList()
                setFavorilerim(favoriResponse)

                if (userResponse.is_magza == true) {
                    const response = await magzaGetir()
                    magzaDispach({ type: "MAGAZA_GETIR", magaza: response })

                } else {
                    return;
                }


            }
        } catch (e) {
            console.log("token doğrulama hatası", e)
            setValidUser(false)
            localStorage.removeItem("token")
            localStorage.removeItem("refresh")
        }
    }

    //kullanıcı çıkışı yaptıran fonksiyon
    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("refresh")
        setValidUser(false)
        window.location.pathname = "/login"
    }

    // bütün ürünleri getiren fonksiyon
    const getProducts = async () => {
        const response = await products()
        setUrunler(response.data)
        // console.log(response.data)

        const bedenResponse = await beden()
        setBedenler(bedenResponse)

        const renkResponse = await renk()
        setUrunRenkleri(renkResponse)

        const categoryResponse = await category()
        setKategoriler(categoryResponse)

    }

    // urun detay sayfası için ait olan ürünü getiren fonksiyon
    const urunDetay = async (id) => {
        const detayResponse = await urunDetayi(id)
        setDetayUrun(detayResponse)

        const yorumResponse = await yorum(id)
        setUrunYorumlari(yorumResponse)

        const puanResponse = await puan(id)
        setUrunPuani(puanResponse)

    }

    //magaza detay sayfası için magaza biligilerini getiren fonksiyon
    const magazaDetay = async (id) => {
        const response = await magazaDetayi(id)
        setMagazaDetaylari(response)

        const magazaUrunResponse = await magazaUrunleriGetir(id)
        magzaDispach({type:"MAGAZA_URUN_GETIR", urunler:magazaUrunResponse})

    }


    const value = {
        userName, setUserName,
        userEmail, setUserEmail,
        userPassword, setUserPassword,
        userPasswordTekrar, setUserPasswordTekrar,
        secilenRenk, setSecilenRenk,
        secilenBeden, setSecilenBeden,
        validUser,
        userSepet, setUserSepet,

        userRegister,
        userLogin,
        logout,

        urunler,
        onlineUser,
        items: cartState.items,
        toplamFiyat: cartState.totalAmount,
        urunDetay,
        detayUrun,
        dispatch,
        tamamlanmisSepetler,
        urunYorumlari,
        kullaniciYorumu, setKullaniciYorumu,
        yorumYapabilir,
        urunPuani,
        kullaniciPuani, setKullaniciPuani,
        kategoriler,
        kategoriDetay,
        favoriDurum,
        favorilerim,
        magzaBilgileri, setMagzaBilgileri,
        magazalar: magzaState.magaza,
        magzaDispach,
        magazaDetay,
        magazaDetaylari,
        urunBilgileri,setUrunBilgileri,
        bedenler,
        urunRenkleri,
        magazaUrunleri:magzaState.urunler,

        addUrun: async (urun) => {
            dispatch({ type: "EKLE", urun, sepetId: userSepet.id, renk: secilenRenk, beden: secilenBeden })
        },

        removeUrun: async (id, sepetUrunId) => {
            dispatch({ type: "REMOVE_URUN", id, sepetUrunId: sepetUrunId, sepetId: userSepet.id })
        },

        incrementAdet: (id, urun, amount) => {
            dispatch({ type: "INCREMENT", id, urun, amount, sepetId: userSepet.id })
        },

        decrementAdet: (id, urun, amount) => {
            dispatch({ type: "DECREMENT", id, urun, amount, sepetId: userSepet.id })
        },

        clearSepet: () => {
            dispatch({ type: "CLEAR", sepetId: userSepet.id })
        },

        getBeden: (bedenId) => {
            const bedens = bedenler.find(beden => beden.id === bedenId)
            return bedens ? bedens.name : ""
        },

        getRenkler: (renkId) => {
            const renkler = urunRenkleri.find(renk => renk.id === renkId)
            return renkler ? renkler.name : ""
        },

        tamamla: () => {
            sepetiTamamla()
            dispatch({ type: "TAMAM_SEPET" })
        },

        userYorumuGönder: async (urunId) => {
            await yorumGönder(onlineUser.id, urunId, kullaniciYorumu)
        },

        satinAlmis: async (urunId) => {
            const response = await urunuAlmisMi(urunId)
            setYorumYapabilir(response)
        },

        userPuanGonder: async (urunId) => {
            await puanGönder(urunId, onlineUser.id, kullaniciPuani)
        },

        getKategori: async (slug) => {
            const response = await kategoriSlug(slug)
            setKategoriDetay(response)
        },

        favoriEkle: async (urunId) => {
            await toggleFavori(urunId)

            const tumFavResponse = await favoriList()
            setFavorilerim(tumFavResponse)
        },

        magazaOlustur: () => {
            magzaDispach({ type: "MAGAZA_OLUSTUR", magzaBilgileri })
        },

        magazaGuncelleme: async (magzaBilgisi, mId) => {
            magzaDispach({ type: "MAGAZA_GUNCELLE", magzaBilgisi, mId })
            
        },

        magazaUrunEkle: async (urunDatasi) => {
            await magazayaUrunEkle(urunDatasi)
        },

        magazaUrunuGuncelle: async (id,urun) => {
            await magazaUrunGuncelle(id,urun)
        },

        magazaUrunSil: async (urunId) => {
            await magazayaUrunSil(urunId)
        },

        magazaSil: async (mId) => {
            await magazayiSil(mId)
        }

    }

    return <GlobalContext.Provider value={value} > {children} </GlobalContext.Provider>
}