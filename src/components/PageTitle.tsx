import { Helmet } from "react-helmet-async";

interface IPageTitle{
    title:string;
}

function PageTitle(props:IPageTitle){
    return(
        <Helmet>
            <title>{props.title}</title>
        </Helmet>
    );
}

export default PageTitle;