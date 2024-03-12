import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { creditCardBlack, radioFilled, radio, successGif } from "../../assets";
import { NavBar, Footer } from "../../components";
import { getKey, req, setKey, getCountry } from "../../requests";
import { getAllParams, setParam } from "../../urlParams";
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import swal from 'sweetalert';
import TextInputBilling from "../../components/textInputBilling/textInputBilling";
import ScaleLoader from "react-spinners/ScaleLoader";
import html2canvas from 'html2canvas';
import "./orders.css";

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}
const isPhone = () => getWindowDimensions().width < 440
const getPrice = () => (getKey("cart") ?? []).map(p => Object.entries(p?.selections ?? {}).filter(([k]) => k.startsWith("pricing-")).map(([_, v]) => parseFloat(v.split(" ")[v.split(" ").length - 1] ?? 0)).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0)
const stripePromise = loadStripe('pk_live_51OEy34JbX5shavtnvHumbLoNAoDYgQl7QYTSa6eN4uiyopxogrzJJPnKacaLVq6UKXWJAAKsqIZfaidfW1g3BJGy00WbYEtGiE');

const Payment = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState("")
    const [notStatus, setNotStatus] = useState("")
    const [date, setDate] = useState(new Date().toISOString().split("T")[0])
    const [error, setError] = useState(null)
    const vendor = getKey("vendor") ?? null
    const navigate = useNavigate()

    useEffect(() => {
        if (!vendor) return navigate('/')

        req('GET', '/user/order', null)
            .then((data) => {
                setLoading(false)
                setOrders(data.orders)
            })
    }, [])

    useEffect(() => {
        console.log(orders)
    }, [])


    const applyFilter = form => form.createdAt?.split("T")?.[0] == date || !date

    return (
        null,
        (
            <>
                <NavBar />
                <div style={{ marginTop: '20px', marginBottom: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div className="order-cactus-topbar" style={{ display: 'flex', width: '78.5%', justifyContent: 'space-between' }}>
                    <h2>Commandes</h2>
                    <input type="date" value={date} onChange={ev => setDate(ev.target.value)} />
                </div>
                    {loading ? <div style={{ display: "flex", width: "100%", height: "70vh", justifyContent: "center", alignItems: "center" }}>
                        <ScaleLoader color="#2b453e"/>
                    </div> : <div className="analytics">
                        <div className='alert alert-danger' style={{ display: error ? 'block' : 'none' }}>{JSON.stringify(error).replace('"', '')}</div>
                        <div className="m-4"></div>
                        <ul className="list-group m-2" style={{ width: '80vw' }}>
                            {orders
                                .filter(form => form?.vendor == JSON.parse(vendor)?._id)
                                .map((form, i) => <>{!applyFilter(form) ? <></> : <li
                                    // _={console.log("FORMSSS",form.selections.product.mainDesc)}
                                    style={{ margin: '20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid black', height: '5rem', padding: '20px' }}
                                    className="list-group-item"
                                    onClick={async ev => {
                                        ev.stopPropagation()
                                        console.log("DTA API", `/user/order/${form.order}`)
                                        setLoading(true)
                                        const { order } = await req('GET', `/user/order/${form.order}`)
                                        setLoading(false)
                                        console.log("ORDER", order)
                                        // navigate("/viewOrder", { state: { order } })

                                        const product = order?.selections?.product
                                        const redirectData = {
                                            product: JSON.stringify(order?.selections?.product),
                                            props: encodeURIComponent(JSON.stringify({
                                                ...order?.selections
                                            })),
                                            order: order?.selections?.uuid,
                                        }
                                        navigate(`/templetedetail?title=${product?.mainDesc}&productCategry=${product?.productCategry}`, {
                                            state: {
                                                orderId: form.order,
                                                printing: true,
                                                editData: encodeURIComponent(JSON.stringify({ ...redirectData })),
                                                product: JSON.stringify(product),
                                            }
                                        })
                                    }}
                                >
                                    <span>{form?.lastName ? `${form?.firstName} ${form?.lastName}, ${form.createdAt?.split("T")?.[0]}, ${form.mainDesc} - ${form.extraDeliveryCharge ? "Charged Extra Delivery" : ""}` : `${form.mainDesc} - ${form.price}€`} | {form?.code ? "Code" : "Paid by Card"}</span>
                                    <div className="btn-container" style={{ display: "flex", alignItems: 'center' }}>
                                        {form.sent ? <span style={{ marginRight: "1rem" }}>Sent</span> : <button className="btn btn-primary" style={{ marginRight: "1rem" }} onClick={async ev => {
                                            ev.stopPropagation()
                                            setOrders(orders.map((form, j) => i == j ? { ...form, sent: true } : form))
                                            await req("PATCH", `/user/order/${form.order}`, { sent: true })
                                        }}>Fini</button>}
                                        {/* {form.printed ? <span style={{ marginRight: "1rem" }}>Printed</span> : <button className="btn btn-primary" style={{ marginRight: "1rem" }} onClick={async ev => {
                                            ev.stopPropagation()
                                            setOrders(orders.map((form, j) => i == j ? { ...form, printed: true } : form))
                                            await req("PATCH", `/user/order/${form.order}`, { printed: true })
                                        }}>Print</button>}
                                        {form.fulfilled ? <span style={{ marginRight: "1rem" }}>Fulfilled</span> : <button className="btn btn-primary" style={{ marginRight: "1rem" }} onClick={async ev => {
                                            ev.stopPropagation()
                                            // setForms(forms.map((form, j) => i == j ? {...form, fulfilled: true} : form))
                                            await req("PATCH", `/user/order/${form.order}`, { fulfilled: true })
                                        }}>Fulfill</button>} */}
                                        {/* <button className="btn btn-danger" onClick={async ev => {
                                            ev.stopPropagation()
                                            // setForms(forms.filter((_, j) => i != j))
                                            await req("DELETE", `/user/order/${form.order}`)
                                        }}>Delete</button> */}
                                    </div>
                                </li>}</>)}
                        </ul>
                    </div>}
                </div>
                <Footer />
            </>
        )
    );
};

export default Payment;
