// Fallback mock data — used only if the real API fails
// Real API: POST https://backend.jotish.in/backend_dev/gettabledata.php
// Body: { "username": "test", "password": "123456" }
//
// Real API response shape:
// {
//   "TABLE_DATA": {
//     "data": [
//       ["Tiger Nixon", "System Architect", "Edinburgh", "5421", "2011/04/25", "$320,800"],
//       ...
//     ]
//   }
// }
// Each row is an array: [name, designation, city, empId, startDate, salary]

export const MOCK_EMPLOYEES = [
  { id: 1,  name: "Arjun Sharma",  designation: "Software Engineer", city: "Mumbai",    empId: "1001", startDate: "2020/01/15", salary: 72000 },
  { id: 2,  name: "Priya Nair",    designation: "Product Manager",   city: "Bangalore", empId: "1002", startDate: "2019/03/22", salary: 95000 },
  { id: 3,  name: "Rohit Mehra",   designation: "UI/UX Designer",    city: "Delhi",     empId: "1003", startDate: "2021/06/10", salary: 61000 },
  { id: 4,  name: "Sneha Kapoor",  designation: "Data Analyst",      city: "Pune",      empId: "1004", startDate: "2018/11/05", salary: 68000 },
  { id: 5,  name: "Vikas Gupta",   designation: "DevOps Engineer",   city: "Hyderabad", empId: "1005", startDate: "2017/09/30", salary: 83000 },
  { id: 6,  name: "Ananya Singh",  designation: "HR Manager",        city: "Chennai",   empId: "1006", startDate: "2016/04/18", salary: 57000 },
  { id: 7,  name: "Kunal Verma",   designation: "Backend Developer", city: "Mumbai",    empId: "1007", startDate: "2020/07/01", salary: 78000 },
  { id: 8,  name: "Meera Iyer",    designation: "Marketing Lead",    city: "Bangalore", empId: "1008", startDate: "2019/12/14", salary: 64000 },
  { id: 9,  name: "Aditya Joshi",  designation: "QA Engineer",       city: "Kolkata",   empId: "1009", startDate: "2022/02/28", salary: 55000 },
  { id: 10, name: "Divya Reddy",   designation: "Business Analyst",  city: "Pune",      empId: "1010", startDate: "2018/08/17", salary: 70000 },
];

export async function fetchEmployees() {
  try {
    const res = await fetch('https://backend.jotish.in/backend_dev/gettabledata.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'test', password: '123456' }),
    });

    const data = await res.json();

    // Navigate to the real array: data.TABLE_DATA.data
    const rows = data?.TABLE_DATA?.data;

    if (!Array.isArray(rows)) {
      throw new Error('TABLE_DATA.data is missing or not an array');
    }

    return rows.map((row, index) => ({
      id:          index,
      name:        row[0],
      designation: row[1],
      city:        row[2],
      empId:       row[3],
      startDate:   row[4],
      salary:      Number(row[5].replace(/[$,]/g, '')), // "$320,800" -> 320800
    }));

  } catch (err) {
    console.warn('API failed, falling back to mock data:', err.message);
    return MOCK_EMPLOYEES;
  }
}
