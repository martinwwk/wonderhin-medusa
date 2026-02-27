
import ListBox from '@/components/shared/filter-list-box';
import React, {useCallback} from "react";
import "@/styles/top-bar.css";
interface Props {
    setViewAs: (value: boolean) => void;
    viewAs: boolean;
}

const TopBar: React.FC<Props> = ({setViewAs, viewAs}) => {
    const handleViewAs = useCallback(() => {
        setViewAs(!viewAs)
    }, [setViewAs, viewAs]);
    
    return (
        <>
            <div className="w-full sm:flex items-center justify-between mb-6 filters-panel ">
                <div className="flex items-center w-full justify-between">
                    <div className="list-view">
                        <div className="btn btn-gridview text-15px">View as:</div>
                        <button type="button" id="grid-5" className={`btn btn-view grid ${viewAs && 'active' || ''}`}
                                onClick={handleViewAs}>
                            <div>
                                <div className="icon-bar"></div>
                                <div className="icon-bar"></div>
                                <div className="icon-bar"></div>
                            </div>
                        </button>
                        <button type="button" id="list-view"
                                className={`btn btn-view list ${!viewAs && 'active' || ''}`}
                                onClick={handleViewAs}>
                            <div>
                                <div className="icon-bar"></div>
                                <div className="icon-bar"></div>
                                <div className="icon-bar"></div>
                            </div>
                        </button>
                    </div>
                    <ListBox
                        options={[
                            {name: 'New arrival', value: 'new-arrival'},
                            {name: 'Best selling', value: 'best-selling'},
                            {name: 'Lowest price', value: 'lowest'},
                            {name: 'Highest price', value: 'highest'},
                           
                        ]}
                    />
                </div>
                
            </div>
        </>
    
    );
}
export default TopBar;
