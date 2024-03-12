const sendmail =  require('./sendemail');

const revenuedetail = async (name,email) => {
    const query = await purchase.find({ authorId: req.userid });
    // console.log(query);

    let currentmonth = 0;
    let currentyear = 0;
    let total = 0

    // Get the current date
    const currentDate = moment();
    const currentDate2 = moment();
    const currentDate3 = moment();
    const currentDate4 = moment();

    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate2.endOf('month');
    const startOfYear = currentDate3.startOf('year');
    const endOfYear = currentDate4.endOf('year');

    // Format the dates if needed
    const formattedStartOfMonth = startOfMonth.format('YYYY-MM-DD');
    const formattedEndOfMonth = endOfMonth.format('YYYY-MM-DD');
    const formattedstartofyear = startOfYear.format('YYYY-MM-DD');
    const formattedEndofyear = endOfYear.format('YYYY-MM-DD');

    // console.log('Start of the current month:', formattedStartOfMonth);
    // console.log('End of the current month:', formattedEndOfMonth);
    // console.log('start of the current year:', formattedstartofyear);
    // console.log('End of the current year:', formattedEndofyear);

    query.map((val, ind) => {
        if (val.purchaseDate >= formattedStartOfMonth && val.purchaseDate <= formattedEndOfMonth) {
            currentmonth += val.price
        }
        if (val.purchaseDate >= formattedstartofyear && val.purchaseDate <= formattedEndofyear) {
            currentyear += val.price
        }
        total += val.price;
        return val;
    })
    const message = `Dear Author ${name}, your this month sale is - Rs.${currentmonth}.00 , this year sale is -
     Rs.${currentyear}.00 and the Total sale is -Rs.${total}.00 till now, `

     // console.log(currentmonth, currentyear, total);
    try {
        await sendmail(email, message);
        return res.status(200).json({
            message: "Stat Email sent"
        })
    } catch (error) {
        console.log(error);
        return next({ status: 500, message: error });
    }

}
module.exports = revenuedetail;