import { useMemo} from "react";
import { ContentContainer } from "../../components/Share";
import PageTitle from "../../components/PageTitle";
import { useLocation } from "react-router-dom";
import SearchKeyword from "../../components/keyword/SearchKeyword";
import KeywordInfoView from "../../components/keyword/KeywordInfoView";


function useQuery(){
    const {search} = useLocation();
    return useMemo(()=> new URLSearchParams(search), [search]);
}

function KeywordAnalysis(){
    const query = useQuery();
    const query_keyword = query.get("keyword");

    return(
        <ContentContainer>
            <PageTitle title="Wish-키워드분석"/>
            <SearchKeyword isBack={Boolean(query_keyword)}/>
            {
                query_keyword && <KeywordInfoView keyword={query_keyword} />
            }
            
            
            
        </ContentContainer>
    );
}

export default KeywordAnalysis;