/// <reference path="typings/jquery/jquery.d.ts" />
interface IProductFinance<T> {
    element: T;
    GetTotalPayment(cur: string, Price: number);
};

class ProductResult implements IProductFinance<HTMLElement>{
    element: HTMLElement;
    public ProductList: Array<Product>;
    public GetList() {
        this.element.innerHTML = "";

        for (var i = 0; i < this.ProductList.length; i++) {
            this.element.innerHTML += "</br><b>" + (i + 1) + "-)</b>" + this.ProductList[i].Name + " ürünün(ID:" +
			this.ProductList[i].ID + ") Kategorisi: " + this.ProductList[i].Category +
            " Fiyatı: " + this.ProductList[i].Price + "<b><font color='orange'>   Birimi: [" + (jQuery.isNumeric(this.ProductList[i].Currency) ? CurrencyType[this.ProductList[i].Currency] : this.ProductList[i].Currency) +
            "]</font></b><font color='Yellow'>   Maliyet= " + this.GetTotalPayment(String(this.ProductList[i].Currency), this.ProductList[i].Price) + " TL </font></br>";
        }
    }

    public GetTotalPayment(cur: string, Price: number) {
        var currencyPayment: number;
        switch (cur) {
            case "$":
            case "2.66":
                currencyPayment = CurrencyType.$;
                break;
            case "Eur":
            case "2.92":
                currencyPayment = CurrencyType.Eur;
                break;
            case "TL":
            case "1":
                currencyPayment = CurrencyType.TL;
                break;
        }

        return (Price * currencyPayment * TaxRate.GetRate(Price)).toFixed(2);
    }

    constructor(el: HTMLElement) {
        this.element = el;
    }
}
enum CurrencyType {
    "$" = 2.66,
    "Eur" = 2.92,
    "TL" = 1
}
class Parts {
	public ID: number;
    public Name: string;
    public Category: string;
	constructor(_ID: number, _Name: string, _Category: string) {
        this.ID = _ID;
        this.Name = _Name;
        this.Category = _Category;
    }
}
class Product extends Parts {
	public Price: number;
    public Currency: CurrencyType;
	constructor(_ID: number, _Name: string, _Category: string, _Price: number, _Currency: CurrencyType) {
        super(_ID, _Name, _Category);
        this.Price = _Price;
        this.Currency = _Currency
	}
}
class TaxRate {
    public static High = 1.25;
    public static Medium = 1.15;
    public static Low = 1.08;

	public static GetRate(Price: number) {
		if (Price > 100) {
			return this.High;
		}
		if (Price > 50) {
			return this.Medium;
		}
		if (Price > 10) {
			return this.Low;
		}
		else
			return 1;

	}
}
window.onload = () => {
    var el = document.getElementById('content');
    var productResult = new ProductResult(el);

    var url = "/api/products";
    //var data = { id: 2 };
    $.ajax({
        url: url,
        //data: data,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (showResult) {
            productResult.ProductList = showResult;
            productResult.GetList();
        }
    });
};
function Add() {
    if ($('#addDiv').css("display") == "none") {
        $('#addDiv').show();
        $('#txtName').focus();
    }
    else {
        $('#addDiv').hide();
    }
}

function Ara() {
    var el = document.getElementById('content');
    var productResult = new ProductResult(el);
    var url = "/api/products";
    if ($('#txtID').val() != "") {
        var data = { id: $('#txtID').val() == "" ? "0" : $('#txtID').val() };
    }
    $.ajax({
        url: url,
        data: data,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (showResult) {
            productResult.ProductList = showResult;
            productResult.GetList();
        }
    });
}

function Save() {

    var cur = CurrencyType.TL;;
    switch ($("#opCurrency option:selected").text()) {
        case "$":
            cur = CurrencyType.$;
            break;
        case "Eur":
            cur = CurrencyType.Eur;
            break;
        case "TL":
            cur = CurrencyType.TL;
            break;
    }
	var prod = new Product(0, $('#txtName').val(), $('#txtCategory').val(), $('#txtPrice').val(), cur);
    var url = "/api/products";
    var el = document.getElementById('content');
    var productResult = new ProductResult(el);
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify(prod),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (showResult) {
            productResult.ProductList = showResult;
            productResult.GetList();
            $('#txtCategory').val('');
            $('#txtName').val('');
            $('#txtPrice').val('');
            $('#txtName').focus();
        }
    });
}