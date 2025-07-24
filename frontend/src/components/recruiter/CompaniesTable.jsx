import { Edit2, MoreHorizontal } from "lucide-react"
import { Avatar, AvatarImage } from "../ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const CompaniesTable = () => {
  const navigate = useNavigate()

  const { companies, searchCompanyText } = useSelector(state => state.company)
  const [filterCompany, setFilterCompany] = useState(companies)

  useEffect(() => {
    const filteredCompany =
      companies.length >= 0 &&
      companies.filter(company => {
        if (!searchCompanyText) return true

        return company?.companyName
          ?.toLowerCase()
          .includes(searchCompanyText.toLowerCase())
      })

    setFilterCompany(filteredCompany)
  }, [companies, searchCompanyText])

  return (
    <div>
      <Table className="border border-gray-200 rounded-xl text-darkBlue">
        <TableCaption>
          {filterCompany?.length === 0
            ? "Get started by listing your companies"
            : "A list of your recent registered companies."}
        </TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="bg-aliceBlue">
          {filterCompany?.length !== 0 && (
            <>
              {filterCompany.map(company => {
                return (
                  <TableRow key={company?._id}>
                    <TableCell>
                      <Avatar className="cursor-pointer">
                        <AvatarImage
                          src={
                            company.logo ||
                            "https://www.adaptivewfs.com/wp-content/uploads/2020/07/logo-placeholder-image-300x300.png"
                          }
                        />
                      </Avatar>
                    </TableCell>
                    <TableCell>{company.companyName}</TableCell>
                    <TableCell>{company.createdAt.split("T")[0]}</TableCell>
                    <TableCell className="text-right">
                      <Popover>
                        <PopoverTrigger>
                          <MoreHorizontal />
                        </PopoverTrigger>
                        <PopoverContent className="w-24 text-darkBlue">
                          <div
                            onClick={() =>
                              navigate(`/my-companies/${company._id}`)
                            }
                            className="flex items-center gap-2 w-fit cursor-pointer"
                          >
                            <Edit2 className="w-4 " />
                            <span>Edit</span>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                )
              })}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default CompaniesTable
