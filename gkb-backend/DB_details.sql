CREATE TABLE "user_details" (
  "userid" integer PRIMARY KEY,
  "username" varchar,
  "email" varchar,
  "roleid" int,
  "password" varchar,
  "salthash" varchar,
  "passwordhash" varchar,
  "createdon" timestamp,
  "updatedon" timestamp,
  "address_one" varchar,
  "address_two" varchar,
  "pincode" varchar,
  "state" varchar,
  "country" varchar,
  "mobileno" integer,
  "active" int
);

CREATE TABLE "wishlist" (
  "wishlist" int,
  "userid" int,
  "productid" int,
  "createdon" timestamp,
  "updatedon" timestamp,
  "createdby" int,
  "updatedby" int,
  "active" int
);

CREATE TABLE "role" (
  "roleid" int PRIMARY KEY,
  "role_type" varchar,
  "createdon" timestamp,
  "updatedon" timestamp,
  "createdby" int,
  "updatedby" int,
  "active" int
);

CREATE TABLE "stock" (
  "stockid" integer PRIMARY KEY,
  "stock_name" varchar,
  "unit" varchar,
  "unit_price" integer,
  "availability" int,
  "createdon" timestamp,
  "updatedon" timestamp,
  "createdby" int,
  "updatedby" int,
  "active" int
);

CREATE TABLE "product" (
  "productid" integer PRIMARY KEY,
  "name" varchar,
  "delivery" int,
  "createdon" timestamp,
  "updatedon" timestamp,
  "createdby" int,
  "updatedby" int,
  "active" int
);

CREATE TABLE "price" (
  "priceid" int PRIMARY KEY,
  "productid" int,
  "unit" integer,
  "unit_price" integer,
  "createdon" timestamp,
  "updatedon" timestamp,
  "createdby" int,
  "updatedby" int,
  "active" int
);

CREATE TABLE "recipe" (
  "recipeid" int PRIMARY KEY,
  "productid" int,
  "recipe_name" varchar,
  "recipe_details" json,
  "createdon" timestamp,
  "updatedon" timestamp,
  "createdby" int,
  "updatedby" int,
  "active" int
);

CREATE TABLE "extra_topping" (
  "ex_toppingid" int PRIMARY KEY,
  "name" varchar,
  "unit" varchar,
  "unitprice" int,
  "createdon" timestamp,
  "updatedon" timestamp,
  "createdby" int,
  "updatedby" int,
  "active" int
);

CREATE TABLE "paymenttype" (
  "paymenttypeid" int,
  "type" varchar,
  "availability" int,
  "createdon" timestamp,
  "updatedon" timestamp,
  "createdby" int,
  "updatedby" int,
  "active" int
);

CREATE TABLE "orders" (
  "orderid" int,
  "userid" int,
  "paymenttypeid" int,
  "orderdetails" json,
  "price" integer,
  "discountid" int,
  "deliveryid" int,
  "taxid" int,
  "createdon" timestamp,
  "updatedon" timestamp,
  "createdby" int,
  "updatedby" int,
  "active" int
);

CREATE TABLE "discount" (
  "discountid" int,
  "type" varchar,
  "promocode" varchar,
  "expiredate" timestamp,
  "precentage" int,
  "createdon" timestamp,
  "updatedon" timestamp,
  "createdby" int,
  "updatedby" int,
  "active" int
);

CREATE TABLE "deliverycharge" (
  "deliverycid" int,
  "type" varchar,
  "price" int,
  "createdon" timestamp,
  "updatedon" timestamp,
  "createdby" int,
  "updatedby" int,
  "active" int
);

CREATE TABLE "Tax" (
  "taxid" int,
  "taxname" int,
  "taxpercentage" int,
  "taxinculde" int,
  "createdon" timestamp,
  "updatedon" timestamp,
  "createdby" int,
  "updatedby" int,
  "active" int
);

ALTER TABLE "recipe" ADD FOREIGN KEY ("productid") REFERENCES "product" ("productid") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "price" ADD FOREIGN KEY ("productid") REFERENCES "product" ("productid") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "user_details" ADD FOREIGN KEY ("roleid") REFERENCES "role" ("roleid") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "orders" ADD FOREIGN KEY ("userid") REFERENCES "user_details" ("userid") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "orders" ADD FOREIGN KEY ("paymenttypeid") REFERENCES "paymenttype" ("paymenttypeid") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "user_details" ADD FOREIGN KEY ("userid") REFERENCES "wishlist" ("userid") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "product" ADD FOREIGN KEY ("productid") REFERENCES "wishlist" ("productid") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "orders" ADD FOREIGN KEY ("discountid") REFERENCES "discount" ("discountid") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "orders" ADD FOREIGN KEY ("deliveryid") REFERENCES "deliverycharge" ("deliverycid") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "orders" ADD FOREIGN KEY ("taxid") REFERENCES "Tax" ("taxid") DEFERRABLE INITIALLY IMMEDIATE;
