import React, { useEffect, useState } from 'react'
import NewsItem from './NewsItem';
import Spineer from './Spineer';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";


const News = (props) => {
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0)
    


    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }



    const updateNews = async () => {
        props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apikey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
        setLoading(true)
        let data = await fetch(url);
        props.setProgress(30);
        let parseData = await data.json();
        props.setProgress(70);
        // console.log(parseData);
        setArticles(parseData.articles)
        setTotalResults(parseData.totalResults)
        setLoading(false)

        props.setProgress(100);
    }

    useEffect(() => {
        updateNews();
        document.title = `${capitalizeFirstLetter(props.category)} - NewsApp`;
         //eslint-disable-next-line
    }, [])

    const fetchMoreData = async () => {
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apikey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
        setPage(page+1)
        let data = await fetch(url);
        let parseData = await data.json();
        //console.log(parseData);
        setArticles(articles.concat(parseData.articles))
        setTotalResults(parseData.totalResults)
        //    loading: false
    };


    // console.log("render"); 
    return (
        <>
            <h1 className="text-center" style={{ margin: '35px 0px',marginTop:'90px'}}>NewsApp- Top {capitalizeFirstLetter(props.category)} Headlines</h1>
            {loading && <Spineer />}
            <InfiniteScroll
                dataLength={articles?.length}
                next={fetchMoreData}
                hasMore={articles?.length !== totalResults}
                loader={<Spineer />}
            >
                <div className="container">
                    <div className="row">
                        {articles?.map((element) => {
                            return <div className="col-md-4" key={element.url}>
                                <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""}
                                    imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                            </div>
                        })}
                    </div>
                </div>
            </InfiniteScroll>


            {/* <div className="container d-flex justify-content-between">
                    <button type="button" disabled={page <= 1} className="btn btn-dark" onClick={handlePrevClick}>&larr; Previous</button>
                    <button type="button" disabled={page + 1 > Math.ceil(totalResults / props.pageSize)} className="btn btn-dark" onClick={handleNextClick}>Next&rarr;</button>
                </div> */}
        </ >
    )
}


News.defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general'
}
News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
}

export default News
