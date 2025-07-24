import { useEffect, useState } from "react"
import { Label } from "./ui/label"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { useDispatch } from "react-redux"
import { setSearchQuery } from "@/redux/jobSlice"

const filterData = [
  {
    filterType: "Location",
    array: ["Dharan", "Biratnagar", "Chitwan", "Kathmandu", "Lalitpur"],
  },
  {
    filterType: "Industry",
    array: ["Frontend Developer", "Backend Developer", "Fullstack Developer"],
  },
  {
    filterType: "Salary",
    array: ["0-40k", "42k-1lakh", "1lakh-5lakh"],
  },
]

const FilterCard = () => {
  const dispatch = useDispatch()
  const [selectedValue, setSelectedValue] = useState("")

  const valueChangeHandler = value => {
    setSelectedValue(value)
  }

  useEffect(() => {
    dispatch(setSearchQuery(selectedValue))
  }, [selectedValue])

  return (
    <div className="w-full bg-white p-3 rounded-md">
      <h1 className="font-bold text-xl">Filter Jobs</h1>
      <hr className="mt-3" />
      <RadioGroup value={selectedValue} onValueChange={valueChangeHandler}>
        {filterData.map((data, index) => (
          <div key={index} className="mt-5">
            <h1 className="font-bold text-lg">{data.filterType}</h1>

            {data.array.map((item, index) => {
              return (
                <div key={index} className="flex items-center space-x-2 my-2">
                  <RadioGroupItem value={item} id={item} />
                  <Label htmlFor={item} className="cursor-pointer">
                    {item}
                  </Label>
                </div>
              )
            })}
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

export default FilterCard
