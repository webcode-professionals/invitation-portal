"use client";
import React, { useState, useEffect } from 'react';
import Layout from "../components/Layout"
import Swal from 'sweetalert2'
import axios from 'axios';

function Home() {
    var members = window.env.wed_family_members;
    var events = window.env.wed_events;
    var testimonials = window.env.wed_testimonials;

    if(window.env.Block_Date) {
        var updateTimer = () => {
            let future = Date.parse(window.env.wed_var21);
            let now = new Date();
            let diff = future - now;
    
            let days = Math.floor(diff / (1000 * 60 * 60 * 24));
            let hours = Math.floor(diff / (1000 * 60 * 60));
            let mins = Math.floor(diff / (1000 * 60));
            let secs = Math.floor(diff / 1000);
    
            let d = days;
            let h = hours - days * 24;
            let m = mins - hours * 60;
            let s = secs - mins * 60;
            document.getElementById("timer")
                .innerHTML =
                '<div>' + d + '<span>days</span></div>' +
                '<div>' + h + '<span>hours</span></div>' +
                '<div>' + m + '<span>minutes</span></div>' +
                '<div>' + s + '<span>seconds</span></div>';
        };
        const interval = setInterval(() => {
            updateTimer();
        }, 1000);
    }

    const topHome = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
    const loginBtn = () => {
        window.location.href = window.env.APP_URL +''+ login_path;
    }

    const  [PortfolioImg, setPortfolioImgList] = useState([])
    useEffect(() => {
        fetchPortfolioImgList()
    }, [])
    const fetchPortfolioImgList = () => {
        axios.get('/api/portfolio-image')
        .then(function (response) {
            setPortfolioImgList(response.data);
            setTimeout(function () {
                // Fancybox
                $('.work-box').fancybox();
            }, 3000);
        })
        .catch(function (error) {
          console.log(error);
        })
    }

    const [cust_name, setCustName] = useState('')
    const [cust_email, setCustEmail] = useState('')
    const [cust_mobile, setCustMobile] = useState('')
    const [cust_message, setCustMessage] = useState('')
    const [isSaving, setIsSaving] = useState(false)

    const validateEmail = (email) => {
        return email.match(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    const XSSPrevent = (field) => {
        return field.includes("<script>");
    }

    const saveRecord = () => {
        setIsSaving(true);
        let formData = new FormData()
        formData.append("cust_name", cust_name)
        formData.append("cust_email", cust_email)
        formData.append("cust_mobile", cust_mobile)
        formData.append("cust_message", cust_message)

        if(cust_name == "" || cust_email == "" || cust_mobile=="" || cust_message==""){
            Swal.fire({
                icon: 'error',
                title: 'Name, email, mobile are required fields.',
                showConfirmButton: true,
                showCloseButton: true,
            })
            setIsSaving(false)
        }
        else if(!validateEmail(cust_email) || XSSPrevent(cust_message) || XSSPrevent(cust_mobile) || XSSPrevent(cust_name)){
            Swal.fire({
                icon: 'error',
                title: 'Provide valid email, message, mobile & name.',
                showConfirmButton: true,
                showCloseButton: true,
            })
            setIsSaving(false)
        }
        else{
            axios.post('/api/sendemail', formData)
                .then(function (response){
                    Swal.fire({
                        icon: 'success',
                        title: 'Quries has been submitted successfully!',
                        showConfirmButton: true,
                    })
                    setIsSaving(false);
                    setCustName('')
                    setCustEmail('')
                    setCustMobile('')
                    setCustMessage('')
                })
                .catch(function (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops, Something went wrong!',
                        showConfirmButton: true,
                    })
            setIsSaving(false)
            });
        }
    }

    return (
        <Layout>
            <div className="inv-portal">
                {/* start preloader */}
                <div className="preloader">
                    <div className="sk-spinner sk-spinner-wave">
                        <div className="sk-rect1"></div>
                        <div className="sk-rect2"></div>
                        <div className="sk-rect3"></div>
                        <div className="sk-rect4"></div>
                        <div className="sk-rect5"></div>
                    </div>
                </div>
                {/* end preloader */}
                {/* header section */}
                <header id="header">
                    <div className="row">
                        <div className="col-md-4 offset-md-4 col-sm-12">
                            <p className="starts">{window.env.wed_starts}</p>
                        </div>
                    </div>
                    <div className="header-content clearfix"> <a className="logo" href="index.html">{window.env.APP_NAME}</a>
                        <nav className="navigation" role="navigation">
                            <ul className="primary-nav">
                                {window.env.Block_Home ? (
                                    <li><a href="#home">{window.env.wed_home}</a></li>
                                ) : (<span></span>)}
                                {window.env.Block_Intro ? (
                                    <li><a href="#intro">{window.env.wed_intro}</a></li>
                                ) : (<span></span>)}
                                {window.env.Block_Event ? (
                                    <li><a href="#event">{window.env.wed_event}</a></li>
                                ) : (<span></span>)}
                                {window.env.Block_Gallery ? (
                                    <li><a href="#gallery">{window.env.wed_gallery}</a></li>
                                ) : (<span></span>)}
                                {window.env.Block_Family ? (
                                    <li><a href="#teams">{window.env.wed_family}</a></li>
                                ) : (<span></span>)}
                                {window.env.Block_Contact ? (
                                    <li><a href="#contact">{window.env.wed_contact}</a></li>
                                ) : (<span></span>)}
                                {window.env.Block_Login ? (
                                    <li><a href="/security/login">{window.env.wed_login}</a></li>
                                ) : (<span></span>)}
                            </ul>
                        </nav>
                        <a href="#" className="nav-toggle">{window.env.APP_NAME}<span></span></a>
                    </div>
                </header>
                {/* banner text -*/}
                {window.env.Block_Home ? (
                    <section className="banner" role="banner" id="home">
                        <div id="carouselBanner" className="carousel slide" data-bs-ride="carousel">
                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#carouselBanner" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                                <button type="button" data-bs-target="#carouselBanner" data-bs-slide-to="1" aria-label="Slide 2"></button>
                                <button type="button" data-bs-target="#carouselBanner" data-bs-slide-to="2" aria-label="Slide 3"></button>
                                <button type="button" data-bs-target="#carouselBanner" data-bs-slide-to="3" aria-label="Slide 4"></button>
                                {/* <button type="button" data-bs-target="#carouselBanner" data-bs-slide-to="4" aria-label="Slide 5"></button> */}
                            </div>
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <img src={"images/slides/1.jpg?" + window.env.wed_version} className="d-block w-100" alt="slide1" />
                                    <div className="carousel-caption d-none d-md-block">
                                        <h3 data-animation="animated bounceInDown">{window.env.wed_person_name}</h3>
                                        <h4 data-animation="animated bounceInUp">{window.env.wed_var1} {window.env.wed_var2}, {window.env.wed_var3}</h4>
                                    </div>
                                </div>
                                <div className="carousel-item">
                                    <img src={"images/slides/2.jpg?" + window.env.wed_version} className="d-block w-100" alt="slide2" />
                                    <div className="carousel-caption d-none d-md-block">
                                        <h3 data-animation="animated bounceInDown">{window.env.wed_var4}</h3>
                                        <h4 data-animation="animated bounceInUp">{window.env.wed_var5}</h4>
                                    </div>
                                </div>
                                <div className="carousel-item">
                                    <img src={"images/slides/3.jpg?" + window.env.wed_version} className="d-block w-100" alt="slide3" />
                                    <div className="carousel-caption d-none d-md-block">
                                        <h3 data-animation="animated bounceInDown">{window.env.wed_person_name}</h3>
                                        <h4 data-animation="animated bounceInUp">{window.env.wed_var1} {window.env.wed_var2}, {window.env.wed_var3}</h4>
                                    </div>
                                </div>
                                <div className="carousel-item">
                                    <img src={"images/slides/4.jpg?" + window.env.wed_version} className="d-block w-100" alt="slide4" />
                                    <div className="carousel-caption d-none d-md-block">
                                        <h3 data-animation="animated bounceInDown">{window.env.wed_var4}</h3>
                                        <h4 data-animation="animated bounceInUp">{window.env.wed_var5}</h4>
                                    </div>
                                </div>
                                {/* <div className="carousel-item">
                                    <img src={"images/slides/5.jpg?" + window.env.wed_version} className="d-block w-100" alt="slide5" />
                                    <div className="carousel-caption d-none d-md-block">
                                        <h3 data-animation="animated bounceInDown">Fifth slide label</h3>
                                        <h4 data-animation="animated bounceInUp">Some representative placeholder content for the fifth slide.</h4>
                                    </div>
                                </div> */}
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#carouselBanner" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#carouselBanner" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </section>
                ) : (<div></div>)}
                {/* header section -*/}
                {/* intro section */}
                {window.env.Block_Intro ? (
                    <section id="intro" className="section intro">
                        <div className="container">
                            <div className="col-md-10 offset-md-1 text-center">
                                <h3>{window.env.wed_var8}</h3>
                                <p>{window.env.wed_var9}</p>
                            </div>
                        </div>
                    </section>
                ) : (<div></div>)}
                {/* intro section -*/}
                {/* section */}
                {window.env.Block_Intro2 ? (
                    <section id="Bride_Groom">
                        <div className="container">
                            <div id="content24" data-section="content-24" className="row data-section">
                                <div className="col-md-5">
                                    {window.env.Block_GroomImg ? (
                                        <img src={"images/groom.jpg?" + window.env.wed_version} alt="groom" className="img-middle img-fluid" />
                                    ) : (<span></span>)}
                                    <div className="align-center">
                                        <h3>{window.env.wed_groom_name}</h3>
                                        <p>{window.env.wed_var12}</p>
                                        <p>{window.env.wed_var13}</p>
                                        <p>{window.env.wed_var14}</p>
                                        <p>{window.env.wed_var15}</p>
                                    </div>
                                </div>
                                <div className="col-md-2 align-content-center">
                                    <div className="align-cente">
                                    {window.env.Block_MidImg ? (
                                        <img src={"images/phere.jpg?" + window.env.wed_version} alt="phere" className="img-phere img-fluid" />
                                    ) : (<span></span>)}
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    {window.env.Block_BrideImg ? (
                                        <img src={"images/bride.jpg?" + window.env.wed_version} alt="bride" className="img-middle img-fluid" />
                                    ) : (<span></span>)}
                                    <div className="align-center">
                                        <h3>{window.env.wed_bride_name}</h3>
                                        <p>{window.env.wed_var16}</p>
                                        <p>{window.env.wed_var17}</p>
                                        <p>{window.env.wed_var18}</p>
                                        <p>{window.env.wed_var19}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                ) : (<div></div>)}
                {/* section -*/}
                {/* intro section */}
                {window.env.Block_Date ? (
                    <section id="savedate" className="section intro">
                        <div className="container">
                            <div className="col-md-10 offset-md-1 text-center">
                                <h3>{window.env.wed_var20}</h3>
                                <p>{window.env.wed_var2}, {window.env.wed_var3}</p>
                                <div id="timer"></div>
                            </div>
                        </div>
                    </section>
                ) : (<div></div>)}
                {/* intro section -*/}
                {/* services section */}
                {window.env.Block_Event ? (
                    <section id="event" className="services service-section">
                        <div className="container">
                            <div className="section-header">
                                <h2 className="wow fadeInDown animated">{window.env.wed_var22}</h2>
                                <p className="wow fadeInDown animated">{window.env.wed_var23}</p>
                            </div>
                            {window.env.wed_events ? (
                                <div className="row">
                                    {events.map((event, key) => {
                                        return (
                                            <div className="col-md-4 col-sm-6 services text-center" key={key}> <span className={event.icon}></span>
                                                <div className="services-content">
                                                    <h5>{event.name}</h5>
                                                    <p>{event.place}</p>
                                                    <p>{event.date}</p>
                                                    <p>{event.time}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (<div className="text-center"><p>{window.env.wed_var29}</p></div>)}
                        </div>
                    </section>
                ) : (<div></div>)}
                {/* services section -*/}
                {/* videos section */}
                {window.env.Block_Video ? (
                    <section className="video-section">
                        <div className="container">
                            <div className="row data-section" data-section="content-24">
                                <div className="col-md-6">
                                    <h3>{window.env.wed_var30}</h3>
                                    <p>{window.env.wed_var31}</p>
                                    
                                </div>
                                <div className="col-md-6">
                                    <div className="embed-responsive embed-responsive-16by9">
                                        <iframe className="embed-responsive-item" src={window.env.wed_var32} allowFullScreen=""></iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                ) : (<div></div>)}
                {/* videos section */}
                {/* gallery section */}
                {window.env.Block_Gallery ? (
                    <section id="gallery" className="gallery section">
                        <div className="container-fluid">
                            <div className="section-header">
                                <h2 className="wow fadeInDown animated">{window.env.wed_var33}</h2>
                                <p className="wow fadeInDown animated">{window.env.wed_var34}</p>
                            </div>
                            <div className="row no-gutter">
                                {PortfolioImg.map((portImg, key) => {
                                    return (
                                        <div className="col-lg-3 col-md-6 col-sm-6 work" key={key}>
                                            <a href={"images/portfolio/" + portImg + "?" + window.env.wed_version} className="work-box">
                                                <img src={"images/portfolio/" + portImg + "?" + window.env.wed_version} alt="" />
                                                <div className="overlay">
                                                    <div className="overlay-caption">
                                                        <p><span className="icon icon-magnifying-glass"></span></p>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="mt-5 text-center"><button onClick={loginBtn} className="btn">{window.env.wed_var35}</button></div>
                        </div>
                    </section>
                ) : (<div></div>)}
                {/* gallery section -*/}
                {/* our team section */}
                {window.env.Block_Family ? (
                    <section id="teams" className="section teams">
                        <div className="container">
                            <div className="section-header">
                                <h2 className="wow fadeInDown animated">{window.env.wed_var10}</h2>
                                <p className="wow fadeInDown animated">{window.env.wed_var11}</p>
                            </div>
                            {window.env.wed_family_members ? (
                                <div className="row">
                                    {members.map((team, key) => {
                                        return (
                                            <div className="col-md-3 col-sm-6" key={key}>
                                                <div className="person">
                                                    {team.img_name ? (<img src={img_path + "/" + team.img_name + "?" + window.env.wed_version} alt="" className="img-fluid" />) : (<span></span>)}
                                                    <div className="person-content">
                                                        <h4>{team.name}</h4>
                                                        <p>{team.relation}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (<div className="text-center"><p>{window.env.wed_var29}</p></div>)}
                        </div>
                    </section>
                ) : (<div></div>)}
                {/* our team section -*/}
                {/* Testimonials section*/}
                {window.env.Block_Testimonials ? (
                    <section id="testimonials" className="section testimonials no-padding">
                        <div className="container-fluid">
                            <div className="row no-gutter">
                                {window.env.wed_testimonials ? (
                                    <div className="flexslider">
                                        <ul className="slides">
                                            {testimonials.map((data, key) => {
                                                return (
                                                    <li key={key}>
                                                        <div className="col-md-12">
                                                            <blockquote>
                                                                <p> {data.description} </p>
                                                                <p> {data.name} </p>
                                                            </blockquote>
                                                        </div>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                ) : (<div className="text-center"><p>{window.env.wed_var29}</p></div>)}
                            </div>
                        </div>
                    </section>
                ) : (<div></div>)}
                {/* Testimonials section */}
                {/* Footer section */}
                {window.env.Block_Contact ? (
                    <section className="section contact" id="contact">
                        <div className="container">
                            <div className="section-header">
                                <h2 className="wow fadeInDown animated">{window.env.wed_var24}</h2>
                                <p className="wow fadeInDown animated"></p>
                            </div>
                        </div>
                        {window.env.WEB_Contact ? (
                            <div className="container">
                                <div className='row'>
                                    <div className='col-md-6 conForm'>
                                        <form method="post" action="#" name="cform" id="cform">
                                            <input name="cust_name" type="text" value={cust_name} className="form-control" placeholder="Your name..." id="fullname" onChange={(event)=>{setCustName(event.target.value)}}/>
                                            <input name="cust_email" type="email" value={cust_email} className="form-control" placeholder="Email Address..." id="email" onChange={(event)=>{setCustEmail(event.target.value)}}/>
                                            <input name="cust_mobile" type="tel" value={cust_mobile} className="form-control" placeholder="Mobile No..." id="tel" onChange={(event)=>{setCustMobile(event.target.value)}}/>
                                            <textarea name="cust_message" rows="3" value={cust_message} className="form-control" id="message" placeholder="Message..." onChange={(event)=>{setCustMessage(event.target.value)}}></textarea>
                                            <button type="button" id="msg_submit" onClick={saveRecord} disabled={isSaving} name="send" className="submitBnt">Send</button>
                                        </form>
                                    </div>
                                    <div className="col-md-6 ps-5">
                                        <p>Create your own invitation website.</p>
                                        <p>At just $18/- or ₹1499/- for 60 days and it will be ready in 30 minutes.</p>
                                        <p className='mb-5'>Share your photographs with your loved ones at just additional cost of $6/- or ₹499/- per month.</p>
                                        <h3>OUR POINT OF CONTACT</h3>
                                        <address className="mt-3">
                                            <p> <i className="fa fa-phone"></i> +91 9464528225</p>
                                            <p> <i className="fa fa-phone"></i> +1 (672) 833-8625</p>
                                            <p> <i className="fa fa-envelope"></i> contact@itdevs.in</p>
                                            <p className="address-title"> <i className="fa fa-map-marker"></i> New Delhi India</p>
                                        </address>
                                    </div>
                                </div>
                            </div>

                        ) : (
                            <div className="container">
                                <div className='row'>
                                    <div className="col-md-4 offset-md-5 col-sm-12">
                                        <h3></h3>
                                        <address className="home-address mt-5">
                                            <p className="address-title"> <i className="fa fa-map-marker"></i> {window.env.wed_var25}</p>
                                            <p> <i className="fa fa-phone"></i> {window.env.wed_var26}</p>
                                            <p> <i className="fa fa-train"></i> {window.env.wed_var27}</p>
                                            <p> <i className="fa fa-plane"></i> {window.env.wed_var28}</p>
                                        </address>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                ) : (<div></div>)}
                <footer id='footer'>
                    {window.env.Block_Map ? (
                        <div className="container-fluid">
                            <div id="map-row" className="row">
                                <div className="col-xs-12">
                                    <iframe title="map" width="100%" height="400" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" src={window.env.wed_map_url}></iframe>
                                </div>
                            </div>
                        </div>
                    ) : (<div></div>)}
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 text-center">
                                <p className="comp wow bounceIn" data-wow-offset="50" data-wow-delay="0.3s">
                                    &copy; {current_year} All Rights Reserved. Designed with <i className="fa-regular fa-heart"></i> by <a href="https://itdevs.in" target="_blank">IT Developers</a>
                                </p>
                            </div>
                        </div>
                    </div>
                    <button onClick={topHome} className="topHome"><i className="fa fa-chevron-up fa-2x"></i></button>
                </footer>
                <div className='advBanner'>
                    <span className='close-cross-btn'>×</span>
                    <p>Create your own invitation website.</p>
                    <p>At just $18/- or ₹1499/- for 60 days and it will be ready in 30 minutes.</p>
                    <p>Share your photographs with your loved ones at just additional cost of $6/- or ₹499/- per month.</p>
                    <p>Contact us via email <a href='mailto:contact@itdevs.in'>contact@itdevs.in</a></p>
                    <p className='text-center'><a className="btn" href='mailto:contact@itdevs.in'>Contact us</a></p>
                </div>
            </div>
        </Layout>
    );
}
export default Home;
