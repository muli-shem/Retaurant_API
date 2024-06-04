
import { pgTable, serial, text, varchar,boolean,integer,timestamp,decimal } from "drizzle-orm/pg-core";
import {relations}from"drizzle-orm";
import {sql} from "drizzle-orm"
//state tabel
export const StateTable = pgTable("state", {
    id: serial("id").primaryKey(),
    name: varchar ("name", {length:255}).notNull(),
    code: varchar("code").notNull(),
    
});
// city

export const cityTable =pgTable("City",{
    id: serial("id").primaryKey(),
    name: varchar ("name",{length:255}).notNull(),
    state_Id: integer("state_Id").notNull().references(() => StateTable.id, {onDelete:"cascade"})

});

// reationships btween city and statetable
export const stateRelations = relations(StateTable,({one ,many})=>({
    city:one(cityTable,{
        fields: [StateTable.id],
        references:[cityTable.state_Id]
    })
}));
export const cityRelations = relations(cityTable, ({ one }) => ({
    state: one(StateTable, {
        fields: [cityTable.state_Id],
        references: [StateTable.id]
    })
}));

// Users table

export const usersTable = pgTable("users", {
    id: serial("id").primaryKey(),
    name: varchar("name",{length:255}).notNull(),
    contact_Phone: varchar("ccontact_Phone").notNull(),
    phone_Verified: boolean("phone_Verified").notNull(),
    email: varchar("email").notNull(),
    email_Verified: boolean("email_Verified").notNull(),
    confirmation_Code: varchar("confirmation_Code").notNull(),
    password: varchar("password").notNull(),
    created_At: timestamp("created_At").default(sql`NOW()`).notNull(),
    updated_At: timestamp("updated_At").default(sql`NOW()`).notNull()
});

//Address table
export const addressTable = pgTable("address", {
    id: serial("id").primaryKey(),
    street_Address1: varchar("street_Address1").notNull(),
    street_Address2: varchar("street_Address2").notNull(),
    zip_Code: varchar("zip_Code").notNull(),
    delivery_Instructions: text("delivery_Instructions").notNull(),
    user_Id: integer("user_Id").notNull().references(() => usersTable.id,  {onDelete:"cascade"}),
    city_Id: integer("city_Id").notNull().references(() => cityTable.id,  {onDelete:"cascade"}),
    created_At: timestamp("created_At").default(sql`NOW()`).notNull(),
    updated_At: timestamp("updated_At").default(sql`NOW()`).notNull()
});

// category table

export const category = pgTable("category", {
    id: serial("id").primaryKey(),
    name: varchar("name").notNull()
});

// Restaurant table
export const restaurantTable =pgTable("restaurant",{
    id: serial("id").primaryKey(),
    name: varchar("name", {length:255}).notNull(),
    street_address: varchar("street_address",{length:255}).notNull(),
    zip_code: varchar("zip_code", {length:255}).notNull(),
    city_id: integer("city_id").notNull().references(()=>cityTable.id, {onDelete:"cascade"}),
    created_At: timestamp("created_At").default(sql`NOW()`).notNull(),
    updated_At: timestamp("updated_At").default(sql`NOW()`).notNull()

});
// menuItem
export const menuItem = pgTable("menu_item", {
    id: serial("serial").primaryKey(),
    name: varchar("name").notNull(),
    restaurantId: integer("restaurant").notNull().references(() => restaurantTable.id, {onDelete:"cascade"}),
    categoryId: integer("category_id").notNull().references(() => category.id,  {onDelete:"cascade"}),
    description: text("description"),
    ingredients: text("ingredients"),
    price: decimal("decimal").notNull(),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("createdAT").default(sql`NOW()`).notNull(),
    updatedAt: timestamp("createdAy").default(sql`NOW()`).notNull()
});
//comment table

export const commentTable = pgTable("comment",{
    id: serial("id").primaryKey(),
    order_id: integer("order_id").notNull().references(()=>ordersTable.id,  {onDelete:"cascade"}),
    user_id: integer("order_id").notNull().references(()=>usersTable.id,  {onDelete:"cascade"}),
    comment_text: varchar("comment_text").notNull(),
    is_complaint: boolean("iscompliment").notNull(),
    is_price: boolean("is_price").notNull(),
    createdAt: timestamp("createdAT").default(sql`NOW()`).notNull(),
    updatedAt: timestamp("createdAy").default(sql`NOW()`).notNull()

});


// Driver table

export const driverTable = pgTable("driver",{
    id: serial("id").primaryKey(),
    car_make: varchar("car_make", {length:245}).notNull(),
    car_model: varchar("car_model",{length:245}).notNull(),
    car_year: varchar("car_year").notNull(),
    user_id: integer("user_id").notNull().references(()=>usersTable.id,  {onDelete:"cascade"}),
    online: boolean("boolean").notNull(),
    delivering:boolean("boolean").notNull(),
    created_At: timestamp("created_At").default(sql`NOW()`).notNull(),
    updated_At: timestamp("updated_At").default(sql`NOW()`).notNull()
});
// Order table

export const ordersTable = pgTable("orders", {
    id: serial("id").primaryKey(),
    restaurant_Id: integer("restaurant_id").notNull().references(() => restaurantTable.id,  {onDelete:"cascade"}),
    estimated_Delivery_Time: timestamp("estimated_Delivery_Time"),
    actual_Delivery_Time: timestamp("actual_Delivery_Time").default(sql`NOW()`).notNull(),
    delivery_Address_Id: integer("actual_Delivery_Time").notNull().references(() => addressTable.id, {onDelete:"cascade"}),
    user_Id: integer("user_id").notNull().references(() => usersTable.id,  {onDelete:"cascade"}),
    driver_Id: integer("dreiver_id").references(() => driverTable.id,  {onDelete:"cascade"}),
    price: decimal("price").notNull(),
    discount: decimal("discount"),
    final_Price: decimal("final"),
    comment: text("comment"),
    created_At: timestamp("created_At").default(sql`NOW()`).notNull(),
    updated_At: timestamp("updated_At").default(sql`NOW()`).notNull()
});
// orderMenuItem
export const orderMenuItemTable = pgTable("order_menu_item", {
    id: serial("id").primaryKey(),
    order_Id: integer("order_id").notNull().references(() => ordersTable.id,  {onDelete:"cascade"}),
    menuItem_Id: integer("menuItem_Id").notNull().references(() => menuItem.id, {onDelete:"cascade"}),
    quantity: integer("quantity").notNull(),
    itemPrice: decimal("decimal").notNull(),
    price: decimal("decimal").notNull(),
    comment: text("comment")
});
// statusCatalog
export const statusCatalogTable = pgTable("status_catalog", {
    id: serial("id").primaryKey(),
    name: varchar("name").notNull()
});
// orderStatus
export const orderStatus = pgTable("order_status", {
    id: serial("id").primaryKey(),
    orderId: integer("oderId").notNull().references(() => ordersTable.id, {onDelete:"cascade"}),
    statusCatalogId: integer("status_Catalog_Id").notNull().references(() => statusCatalogTable.id, {onDelete:"cascade"}),
    createdAt: timestamp("createAt").notNull().default(sql`NOW()`).notNull(),
});

// restaurantOwner
export const restaurantOwneTable = pgTable("restaurant_owner", {
    id: serial("id").primaryKey(),
    restaurantId: integer("restaurantId").notNull().references(() => restaurantTable.id, {onDelete:"cascade"}),
    ownerId: integer("ownerId").notNull().references(() => usersTable.id, {onDelete:"cascade"})
});

