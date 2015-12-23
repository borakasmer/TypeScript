using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace TypeScript.Controllers
{
    public class Product
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }
        public decimal Price { get; set; }
        public string Currency { get; set; }
    }

    public static class ProductData
    {
        static List<Product> products = new List<Product>()
        {
            new Product { ID = 1, Name = "Tomato Soup", Category = "Groceries", Price = 1, Currency="TL" },
            new Product { ID = 2, Name = "Yo-yo", Category = "Toys", Price = 3.75M, Currency="Eur" },
            new Product { ID = 3, Name = "Hammer", Category = "Hardware", Price = 16.99M, Currency="$"}
        };

        public static List<Product> GetData
        {
            get
            {
                return products;
            }
        }
    }
    public class ProductsController : ApiController
    {
        // GET api/values
        public IEnumerable<Product> GetAllProducts()
        {
            return ProductData.GetData;
        }

        public IEnumerable<Product> GetProduct(int id)
        {
            if (id != 0)
            {
                var product = ProductData.GetData.Where((p) => p.ID == id);
                if (product == null)
                {
                    return new List<Product>();
                }
                return product;
            }
            else
            {
                return GetAllProducts();

            }
        }

        // POST api/values
        public IEnumerable<Product> InsertProduct(Product prod)
        {
            prod.ID = ProductData.GetData.Last().ID + 1;
            ProductData.GetData.Add(prod);
            return ProductData.GetData;
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }
    }
}
