var picker = new Lightpick({ 
    field: document.querySelector('#datepicker'),
    singleDate: false,
    selectForward: true,
    onSelect: (start, end) => {
        var str = '';
        str += start ? start.format('Do MMMM YYYY') + ' to ' : '';
        str += end ? end.format('Do MMMM YYYY') : '...';
        document.querySelector('#datepicker').innerHTML = str;
    }
});