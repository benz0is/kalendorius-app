import React from 'react';
import moment from 'moment';
import './App.css';

export default class Calendar extends React.Component {
    state = {
        dateContext: moment(),
        today: moment(),
        showMonthPopup: false,
        showYearPopup: false,
        selectedDay: null
    }

    constructor(props) {
        super(props);
        this.width = props.width || "1000px";
        this.style = props.style || {};
        this.style.width = this.width;
    }


    weekdays = moment.weekdays();
    weekdaysShort = moment.weekdaysShort(); 
    months = moment.months();

    year = () => {
        return this.state.dateContext.format("Y");
    }
    month = () => {
        return this.state.dateContext.format("MMMM");
    }
    daysInMonth = () => {
        return this.state.dateContext.daysInMonth();
    }
    monthNumber = ()=>{
        return this.state.dateContext.format("M")
    }
    currentDate = () => {
        return this.state.dateContext.get("date");
    }
    currentDay = () => {

        return this.state.dateContext.format("D");
    }

    firstDayOfMonth = () => {
        let dateContext = this.state.dateContext;
        let firstDay = moment(dateContext).startOf('month').format('d');
        return firstDay;
    }

    setMonth = (month) => {
        let monthNo = this.months.indexOf(month);
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).set("month", monthNo);
        this.setState({
            dateContext: dateContext
        });
    }

    
    nextMonth = () => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).add(1, "month");
        this.setState({
            dateContext: dateContext
        });
        this.props.onNextMonth && this.props.onNextMonth();
    }

    prevMonth = () => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).subtract(1, "month");
        this.setState({
            dateContext: dateContext
        });
        this.props.onPrevMonth && this.props.onPrevMonth();
    }

    onSelectChange = (e, data) => {
        this.setMonth(data);
        this.props.onMonthChange && this.props.onMonthChange();

    }
    SelectList = (props) => {
        let popup = props.data.map((data) => {
            return (
                <div key={data}>
                
                    <a href="#" onClick={(e)=> {this.onSelectChange(e, data)}} style={{textDecoration:"none",color:'black'}}>
                        {data}
                    </a>
                </div>
            );
        });

        return (
            <div className="month-popup" >
                {popup}
            </div>
        );
    }

    onChangeMonth = (e, month) => {
        this.setState({
            showMonthPopup: !this.state.showMonthPopup
        });
    }

    MonthNav = () => {
        return (
            <span className="label-month"
                onClick={(e)=> {this.onChangeMonth(e, this.month())}}>
                {this.month()}
                {this.state.showMonthPopup &&
                 <this.SelectList data={this.months} />
                }
            </span>
        );
    }

    showYearEditor = () => {
        this.setState({
            showYearNav: true
        });
    }

    setYear = (year) => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).set("year", year);
        this.setState({
            dateContext: dateContext
        })
    }
    onYearChange = (e) => {
        this.setYear(e.target.value);
        this.props.onYearChange && this.props.onYearChange(e, e.target.value);
    }

    onKeyUpYear = (e) => {
        if (e.which === 13 || e.which === 27) {
            this.setYear(e.target.value);
            this.setState({
                showYearNav: false
            })
        }
    }

    YearNav = () => {
        return (
            this.state.showYearNav ?
            <input
                defaultValue = {this.year()}
                className="editor-year"
                ref={(yearInput) => { this.yearInput = yearInput}}
                onKeyUp= {(e) => this.onKeyUpYear(e)}
                onChange = {(e) => this.onYearChange(e)}
                type="number"
                placeholder="year"/>
            :
            <span
                className="label-year"
                onClick={(e)=> { this.showYearEditor()}}>
                {this.year()}
            </span>
        );
    }

    render() {
        let weekdays = this.weekdaysShort.map((day) => {
            return (
                <td key={day} className="week-day">{day}</td>
            )
        });

        let blanks = [];
        for (let i = 0; i < this.firstDayOfMonth(); i++) {
            blanks.push(<td key={i * 80} className="emptySlot">
                {""}
                </td>
            );
        }


        let daysInMonth = [];
        for (let d = 1; d <= this.daysInMonth(); d++) {
            let date = new Date()
            let currentMonthNumber = date.getMonth()
            let currentMonth = moment.months()[currentMonthNumber]
            let className = (d == this.currentDay() && currentMonth === this.month() && date.getFullYear() == this.year()? "day current-day": "day");
            let selectedClass = (d == this.state.selectedDay ? " selected-day " : "")
            const getDayName=(dateStr)=>{
                var date = new Date(dateStr);
                return date.toLocaleDateString("en-US", { weekday: 'long' })}
            var dateStr = `${this.monthNumber()}/${d}/${this.year()}`
            function getNthDayOfMonth(index,day,month,year){
                var date = new Date();
                date.setDate(1);
                if(month != "”" && month!==undefined){
                date.setMonth(month);
                
                }else{
                month = date.getMonth();
                }
                if(year!=="”"&&year!==undefined){
                date.setFullYear(year);
                }else{
                year = date.getFullYear();
                }
                let firstDay = date.getDay();

                while(date.getDay()!=day){
                date.setDate(date.getDate()+1) ;
                }
                switch(index){
                case 2:
                date.setDate(date.getDate()+7);
                break;
                case 3:
                date.setDate(date.getDate()+14);
                break;
                case 4:
                date.setDate(date.getDate()+21);
                break;
                case 5:
                date.setDate(date.getDate()+28);
                if(date.getMonth()!==month){
                date = null;
                }
                break;
                }
                return date;
                }
                console.log(moment(getNthDayOfMonth(3,1,this.monthNumber()-1,this.year())).format('D'))
            daysInMonth.push(
                <td key={d} className={className + selectedClass} >
                    <span onClick={(e)=>{this.onDayClick(e, d)}}>{d}
                    <div style={{background:"yellow"}}>{getDayName(dateStr) === "Monday" ? "Stand-up meeting": ""}
                    </div>
                    <div style={{background:"yellow",color:"yellow"}}>                        {getDayName(dateStr) !== "Monday" && getDayName(dateStr) !== "Saturday" && getDayName(dateStr) !== "Sunday" ? "Stand-up meeting": ""}</div>
                    <div style={{background:"pink"}}>{getDayName(dateStr) === "Friday" ? "Demo meeting":""}</div>
            <div style={{background:"green"}}>{moment(getNthDayOfMonth(1,1,this.monthNumber()-1,this.year())).format('D') == d || moment(getNthDayOfMonth(3,1,this.monthNumber()-1,this.year())).format('D')  == d || moment(getNthDayOfMonth(5,1,this.monthNumber()-1,this.year())).format('D')  == d? "Planning meeting":""}</div>
                    </span>
                </td>
            );
        }



        var totalSlots = [...blanks, ...daysInMonth];
        let rows = [];
        let cells = [];

        totalSlots.forEach((row, i) => {
            if ((i % 7) !== 0) {
                cells.push(row);
            } else {
                let insertRow = cells.slice();
                rows.push(insertRow);
                cells = [];
                cells.push(row);
            }
            if (i === totalSlots.length - 1) {
                let insertRow = cells.slice();
                rows.push(insertRow);
            }
        });

        let trElems = rows.map((d, i) => {
            return (
                <tr key={i*100}>
                    {d}
                </tr>
            );
        })

        return (
            <div className="calendar-container" style={this.style}>
                <table className="calendar">
                    <thead>
                        <tr className="calendar-header">
                            <td colSpan="5">
                                <this.MonthNav />
                                {" "}
                                <this.YearNav />
                            </td>
                            <td colSpan="2" className="nav-month">
                                <i className="prev fa fa-fw fa-chevron-left"
                                    onClick={(e)=> {this.prevMonth()}}>
                                </i>
                                <i className="prev fa fa-fw fa-chevron-right"
                                    onClick={(e)=> {this.nextMonth()}}>
                                </i>

                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {weekdays}
                        </tr>
                        {trElems}
                    </tbody>
                </table>

            </div>

        );
    }
}