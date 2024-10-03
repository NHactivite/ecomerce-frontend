import { AiOutlineSortAscending, AiOutlineSortDescending } from "react-icons/ai";
import {useTable,Column, TableOptions,usePagination,useSortBy} from "react-table";


function TableHOC<T extends Object>(columns:Column<T>[],data:T[],containerClassName:string,heading:string,showPagination=false){
  return function HOC(){
    
    const options:TableOptions<T>={
      columns,
      data,
      initialState:{pageSize:5}
    }


    const {getTableBodyProps,getTableProps,headerGroups,page,prepareRow,nextPage,previousPage,canNextPage,canPreviousPage,pageCount,state:{pageIndex},gotoPage}=useTable(options,useSortBy,usePagination);
     return (
      <div className={containerClassName}>
           <div className="headingContainer"><h2 className="heading">{heading}</h2></div>

           <table className="table" {...getTableProps()}>
               <thead >
                  {
                    headerGroups.map((headerGroup,idx)=>(
                      <tr {...headerGroup.getHeaderGroupProps()} key={idx}>
                        {
                          headerGroup.headers.map((column,idx)=>(
                            <th {...column.getHeaderProps(column.getSortByToggleProps())} key={idx}>
                              {column.render("Header")}
                              {' '}
                              {
                                column.isSorted && <span>{column.isSortedDesc?<AiOutlineSortDescending/>:<AiOutlineSortAscending/>}</span>
                              }
                            </th>
                          ))
                        }
                      </tr>
                    ))
                  }
               </thead>
               <tbody {...getTableBodyProps()}>
                        {
                          page.map((row,idx)=>{
                            prepareRow(row);
                            return (
                              <tr {...row.getRowProps()} key={idx}>
                                {
                                  row.cells.map((cell,idx)=>(
                                    <td {...cell.getCellProps()} key={idx}>
                                      {
                                        cell.render("Cell")
                                      }
                                    </td>
                                  ))
                                }
                              </tr>
                            )
                          })
                        }    
               </tbody>
               
           </table>
           {
                showPagination && 
                <div className="tablePagination">
                  <button disabled={!canPreviousPage} onClick={()=>gotoPage(0)}>First Page</button>
                   <button disabled={!canPreviousPage} onClick={previousPage}>Prev</button>
                   {<span>{`${pageIndex+1} of ${pageCount}`}</span>}
                   <button  disabled={!canNextPage} onClick={nextPage}>Next</button>
                   <button disabled={!canNextPage} onClick={()=>gotoPage(pageCount-1)}>Last Page</button>
                </div>
               }
     </div> 
     ) 
  }
}

export default TableHOC
