import React from 'react'

function Error404() {
    const handleClick = () => {
        window.location.href = process.env.APP_URL;
    }
  return (
    <div id='error404'>
        <div>
            <figure>
                <div className="sad-mac"></div>
                <figcaption>
                    <span className="sr-text">Error 404: Not Found</span>
                    <span className="e"></span>
                    <span className="r"></span>
                    <span className="r"></span>
                    <span className="o"></span>
                    <span className="r"></span>
                    <span className="_4"></span>
                    <span className="_0"></span>
                    <span className="_4"></span>
                    <span className="n"></span>
                    <span className="o"></span>
                    <span className="t"></span>
                    <span className="f"></span>
                    <span className="o"></span>
                    <span className="u"></span>
                    <span className="n"></span>
                    <span className="d"></span>
                </figcaption>
            </figure>
        </div>
        <div className='text-center color-white mt-1'>
            <h1 className=''>Oh ho You have typed wrong url</h1>
            <button onClick={handleClick} type="button" className="btn btn-info">Return to {process.env.APP_NAME}</button>
        </div>  
    </div>
  )
}

export default Error404
