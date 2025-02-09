"use client";
import React, { useState, useEffect } from 'react';
import Layout from "../components/Layout"
import Swal from 'sweetalert2'
import axios from 'axios';

function Home() {
    var members = window.env.wed_family_members;
    var events = window.env.wed_events;
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

    const topHome = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
    const loginBtn = () => {
        window.location.href = process.env.APP_URL +''+ login_path;
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
                                <li><a href="#home">{window.env.wed_home}</a></li>
                                <li><a href="#intro">{window.env.wed_intro}</a></li>
                                <li><a href="#event">{window.env.wed_event}</a></li>
                                <li><a href="#gallery">{window.env.wed_gallery}</a></li>
                                <li><a href="#teams">{window.env.wed_family}</a></li>
                                <li><a href="#contact">{window.env.wed_contact}</a></li>
                            </ul>
                        </nav>
                        <a href="#" className="nav-toggle">{window.env.APP_NAME}<span></span></a>
                    </div>
                </header>
                {/* banner text -*/}
                <section className="banner" role="banner" id="home">
                    <div id="carouselBanner" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-indicators">
                            <button type="button" data-bs-target="#carouselBanner" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                            <button type="button" data-bs-target="#carouselBanner" data-bs-slide-to="1" aria-label="Slide 2"></button>
                            <button type="button" data-bs-target="#carouselBanner" data-bs-slide-to="2" aria-label="Slide 3"></button>
                            <button type="button" data-bs-target="#carouselBanner" data-bs-slide-to="3" aria-label="Slide 4"></button>
                            <button type="button" data-bs-target="#carouselBanner" data-bs-slide-to="4" aria-label="Slide 5"></button>
                        </div>
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <img src="images/slides/1.jpg" className="d-block w-100" alt="slide1" />
                                <div className="carousel-caption d-none d-md-block">
                                    <h3 data-animation="animated bounceInDown">First slide label</h3>
                                    <h4 data-animation="animated bounceInUp">Some representative placeholder content for the first slide.</h4>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <img src="images/slides/2.jpg" className="d-block w-100" alt="slide2" />
                                <div className="carousel-caption d-none d-md-block">
                                    <h3 data-animation="animated bounceInDown">Second slide label</h3>
                                    <h4 data-animation="animated bounceInUp">Some representative placeholder content for the second slide.</h4>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <img src="images/slides/3.jpg" className="d-block w-100" alt="slide3" />
                                <div className="carousel-caption d-none d-md-block">
                                    <h3 data-animation="animated bounceInDown">Third slide label</h3>
                                    <h4 data-animation="animated bounceInUp">Some representative placeholder content for the third slide.</h4>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <img src="images/slides/4.jpg" className="d-block w-100" alt="slide4" />
                                <div className="carousel-caption d-none d-md-block">
                                    <h3 data-animation="animated bounceInDown">Forth slide label</h3>
                                    <h4 data-animation="animated bounceInUp">Some representative placeholder content for the forth slide.</h4>
                                </div>
                            </div>
                            <div className="carousel-item">
                                <img src="images/slides/5.jpg" className="d-block w-100" alt="slide5" />
                                <div className="carousel-caption d-none d-md-block">
                                    <h3 data-animation="animated bounceInDown">Fifth slide label</h3>
                                    <h4 data-animation="animated bounceInUp">Some representative placeholder content for the fifth slide.</h4>
                                </div>
                            </div>
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
                {/* header section -*/}
                {/* intro section */}
                <section id="intro" className="section intro">
                    <div className="container">
                        <div className="col-md-10 offset-md-1 text-center">
                            <h3>{window.env.wed_var8}</h3>
                            <p>{window.env.wed_var9}</p>
                        </div>
                    </div>
                </section>
                {/* intro section -*/}
                {/* section */}
                <section id="Bride_Groom">
                    <div className="container">
                        <div id="content24" data-section="content-24" className="row data-section">
                            <div className="col-md-6">
                                <img src="images/groom.jpg" alt="bride" className="img-middle img-fluid" />
                                <div className="align-center">
                                    <h3>{window.env.wed_groom_name}</h3>
                                    <p>{window.env.wed_var12}</p>
                                    <p>{window.env.wed_var13}</p>
                                    <p>{window.env.wed_var14}</p>
                                    <p>{window.env.wed_var15}</p>
                                </div>
                            </div>
                            {/* <div className="col-md-2">
                                <div className="align-center">
                                <img src="images/phere.jpg" alt="phere" className="img-phere img-fluid" />
                                </div>
                            </div> */}
                            <div className="col-md-6">
                                <img src="images/bride.jpg" alt="bride" className="img-middle img-fluid" />
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
                {/* section -*/}
                {/* intro section */}
                <section id="savedate" className="section intro">
                    <div className="container">
                        <div className="col-md-10 offset-md-1 text-center">
                            <h3>{window.env.wed_var20}</h3>
                            <p>{window.env.wed_var2}, {window.env.wed_var3}</p>
                            <div id="timer"></div>
                        </div>
                    </div>
                </section>
                {/* intro section -*/}
                {/* services section */}
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
                {/* services section -*/}
                {/* videos section */}
                <section className="video-section">
                    <div className="container">
                        <div className="row data-section" data-section="content-24">
                            <div className="col-md-6">
                                <h3>Videos</h3>
                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.</p>
                                <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.</p>
                            </div>
                            <div className="col-md-6">
                                <div className="embed-responsive embed-responsive-16by9">
                                    <iframe className="embed-responsive-item" src="https://player.vimeo.com/video/146742515?badge=0" allowFullScreen=""></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* videos section */}
                {/* gallery section */}
                <section id="gallery" className="gallery section">
                    <div className="container-fluid">
                        <div className="section-header">
                            <h2 className="wow fadeInDown animated">Gallery</h2>
                            <p className="wow fadeInDown animated">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eget risus vitae massa</p>
                        </div>
                        <div className="row no-gutter">
                            {PortfolioImg.map((portImg, key) => {
                                return (
                                    <div className="col-lg-3 col-md-6 col-sm-6 work" key={key}>
                                        <a href={"images/" + portImg} className="work-box">
                                            <img src={"images/" + portImg} alt="" />
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
                        <div className="mt-5 text-center"><button onClick={loginBtn} className="btn">View more</button></div>
                    </div>
                </section>
                {/* gallery section -*/}
                {/* our team section */}
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
                                                <img src={img_path + "/" + team.img_name} alt="" className="img-fluid" />
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
                {/* our team section -*/}
                {/* Testimonials section*/}
                <section id="testimonials" className="section testimonials no-padding">
                    <div className="container-fluid">
                        <div className="row no-gutter">
                            <div className="flexslider">
                                <ul className="slides">
                                    <li>
                                        <div className="col-md-12">
                                            <blockquote>
                                                <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eget risus vitae massa
                                                    semper aliquam quis mattis consectetur adipiscing elit.." </p>
                                                <p>Chris Mentsl</p>
                                            </blockquote>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="col-md-12">
                                            <blockquote>
                                                <p>"Praesent eget risus vitae massa Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eget risus vitae massa
                                                    semper aliquam quis mattis consectetur adipiscing elit.." </p>
                                                <p>Kristean velnly</p>
                                            </blockquote>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="col-md-12">
                                            <blockquote>
                                                <p>"Consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eget risus vitae massa
                                                    semper aliquam quis mattis consectetur adipiscing elit.." </p>
                                                <p>Markus Denny</p>
                                            </blockquote>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="col-md-12">
                                            <blockquote>
                                                <p>"Vitae massa semper aliquam Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eget risus vitae massa
                                                    semper aliquam quis mattis consectetur adipiscing elit.." </p>
                                                <p>John Doe</p>
                                            </blockquote>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Testimonials section */}
                {/* Footer section */}
                <footer className="footer mt-3" id="contact">
                    <div className="container-fluid">
                        <div id="map-row" className="row">
                            <div className="col-xs-12">
                                <iframe title="map" width="100%" height="400" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" src={window.env.wed_map_url}></iframe>
                            </div>
                        </div>
                    </div>
                    <div className="container-fluid intro pt-5">
                        <div className="col-md-10 offset-md-1 text-center">
                            <h3>{window.env.wed_var24}</h3>
                            <div className="contact">
                                <p>{window.env.wed_var25}</p>
                                <p> <i className="fa fa-phone"></i> {window.env.wed_var26}</p>
                                <p> <i className="fa fa-train"></i> {window.env.wed_var27}</p>
                                <p> <i className="fa fa-plane"></i> {window.env.wed_var28}</p>
                            </div>
                            <p className="comp">
                                © {current_year} IT Developers. Designed by <i className="fa-regular fa-heart"></i> <a target="_blank" href="https://itdevs.in" title="IT Developers" rel="noreferrer">IT Developers</a>
                            </p>
                        </div>
                    </div>
                    <button onClick={topHome} className="topHome"><i className="fa fa-chevron-up fa-2x"></i></button>
                </footer>
            </div>
        </Layout>
    );
}
export default Home;
