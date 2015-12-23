var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="typings/jquery/jquery.d.ts" />
;
var ProductResult = (function () {
    function ProductResult(el) {
        this.element = el;
    }
    ProductResult.prototype.GetList = function () {
        this.element.innerHTML = "";
        for (var i = 0; i < this.ProductList.length; i++) {
            this.element.innerHTML += "</br><b>" + (i + 1) + "-)</b>" + this.ProductList[i].Name + " ürünün(ID:" + this.ProductList[i].ID + ") Kategorisi: " + this.ProductList[i].Category + " Fiyatı: " + this.ProductList[i].Price + "<b><font color='orange'>   Birimi: [" + (jQuery.isNumeric(this.ProductList[i].Currency) ? CurrencyType[this.ProductList[i].Currency] : this.ProductList[i].Currency) + "]</font></b><font color='Yellow'>   Maliyet= " + this.GetTotalPayment(String(this.ProductList[i].Currency), this.ProductList[i].Price) + " TL </font></br>";
        }
    };
    ProductResult.prototype.GetTotalPayment = function (cur, Price) {
        var currencyPayment;
        switch (cur) {
            case "$":
            case "2.66":
                currencyPayment = 2.66 /* $ */;
                break;
            case "Eur":
            case "2.92":
                currencyPayment = 2.92 /* Eur */;
                break;
            case "TL":
            case "1":
                currencyPayment = 1 /* TL */;
                break;
        }
        return (Price * currencyPayment * TaxRate.GetRate(Price)).toFixed(2);
    };
    return ProductResult;
})();
var CurrencyType;
(function (CurrencyType) {
    CurrencyType[CurrencyType["$"] = 2.66] = "$";
    CurrencyType[CurrencyType["Eur"] = 2.92] = "Eur";
    CurrencyType[CurrencyType["TL"] = 1] = "TL";
})(CurrencyType || (CurrencyType = {}));
var Parts = (function () {
    function Parts(_ID, _Name, _Category) {
        this.ID = _ID;
        this.Name = _Name;
        this.Category = _Category;
    }
    return Parts;
})();
var Product = (function (_super) {
    __extends(Product, _super);
    function Product(_ID, _Name, _Category, _Price, _Currency) {
        _super.call(this, _ID, _Name, _Category);
        this.Price = _Price;
        this.Currency = _Currency;
    }
    return Product;
})(Parts);
var TaxRate = (function () {
    function TaxRate() {
    }
    TaxRate.GetRate = function (Price) {
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
    };
    TaxRate.High = 1.25;
    TaxRate.Medium = 1.15;
    TaxRate.Low = 1.08;
    return TaxRate;
})();
window.onload = function () {
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
    var cur = 1 /* TL */;
    ;
    switch ($("#opCurrency option:selected").text()) {
        case "$":
            cur = 2.66 /* $ */;
            break;
        case "Eur":
            cur = 2.92 /* Eur */;
            break;
        case "TL":
            cur = 1 /* TL */;
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
//# sourceMappingURL=Products.js.map