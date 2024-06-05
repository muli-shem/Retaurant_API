
import { pgTable, serial, text, varchar,boolean,integer,timestamp,decimal } from "drizzle-orm/pg-core";
import {relations}from"drizzle-orm";
import {sql} from "drizzle-orm"
import { One } from "drizzle-orm";
//state tabel
export const StateTable = pgTable("state", {
    id: serial("id").primaryKey(),
    name: varchar ("name", {length:255}).notNull(),
    code: varchar("code").notNull(),
    
});           
// / city table

export const cityTable =pgTable("City",{
    id: serial("id").primaryKey(),
    name: varchar ("name",{length:255}).notNull(),
    state_Id: integer("state_Id").notNull().references(() => StateTable.id, {onDelete:"cascade"})

});
  // City belongs to a State
export const cityRelations = relations(cityTable, ({ one }) => ({
    state: one(StateTable, {
        fields: [cityTable.state_Id],
        references: [StateTable.id]
    })
}));
//City and Address   -------City has many Addresses

export const CityAddressRelations = relations(cityTable, ({ one, many }) => ({
   // A city can have many addresses
    address: one(addressTable, {
        fields: [cityTable.id],
        references: [addressTable.city_Id]
    })
}));
// City relationship with restaurant 
export const CityRelations = relations(cityTable, ({one, many})=>({
    restaurant: one(restaurantTable,{
        fields:[cityTable.id],
        references:[restaurantTable.city_id]
    })
}));

// export const restaurantCityRelations = relations(cityTable, ({one})=>({
//     city:one(cityTable,{
//         fields:[restaurantTable.city_id],
//         references:[cityTable.id]
//     })
// }))

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
//User and Address relationship  -- User has many Addresses
// Defining the relationship from usersTable to addressTable
export const userRelations = relations(usersTable, ({ one,many }) => ({
    // A user can have many addresses
    addresses: one(addressTable, {
        fields: [usersTable.id],  // The primary key in the usersTable
        references: [addressTable.user_Id] // The foreign key in the addressTable that references the usersTable
    })
}));
// Order belongs to a User
export const orderUserRelations = relations(usersTable, ({ one }) => ({
    user: one(ordersTable, {
        fields: [usersTable.id],
        references: [ordersTable.user_Id]
    })
}));



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

// Address belongs to a User

// Defining the relationship from addressTable to usersTable
export const addressRelations = relations(addressTable, ({one }) => ({
    // An address belongs to one user
    user: one(usersTable, {
        fields: [addressTable.user_Id], // The foreign key in the addressTable
        references: [usersTable.id]   // The primary key in the usersTable
    })
}));
// An address belongs to city 
export const addressCityRelations = relations(addressTable, ({ many, one }) => ({
    city: one(cityTable, {
        fields: [addressTable.city_Id],
        references: [cityTable.id]
    })
}));
// An address belongs to oders
export const addressOrderRelations = relations(addressTable, ({ one, many }) => ({
    orders: one(ordersTable, {
        fields: [addressTable.id],
        references: [ordersTable.delivery_Address_Id],
    })
}));


// category table

export const category = pgTable("category", {
    id: serial("id").primaryKey(),
    name: varchar("name").notNull()
});
export const categoryMenuRelations = relations(category, ({one, many }) => ({
    menuItems: one(menuItemTable, {
        fields: [category.id],
        references: [menuItemTable.categoryId]
    })
}));

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

// Restaurant has many Owners (via RestaurantOwner)
export const restaurantOwnerRelations = relations(restaurantTable, ({one,  many }) => ({
    owners: one(restaurantOwneTable, {
        fields: [restaurantTable.id],
        references: [restaurantOwneTable.restaurantId]
    })
}));



// menuItem
export const menuItemTable = pgTable("menu_item", {
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
// MenuItem belongs to a Restaurant
export const menuItemRestaurantRelations = relations(menuItemTable, ({ one }) => ({
    restaurant: one(restaurantTable, {
        fields: [menuItemTable.restaurantId],
        references: [restaurantTable.id]
    })
}));
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

// Comment belongs to a User
export const commentUserRelations = relations(commentTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [commentTable.user_id],
        references: [usersTable.id]
    })
}));
// Comment belongs to an Order
export const commentOrderRelations = relations(commentTable, ({ one }) => ({
    order: one(ordersTable, {
        fields: [commentTable.order_id],
        references: [ordersTable.id]
    })
}));


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
export const driverOrderRelations = relations(driverTable, ({ one,many }) => ({
    orders: one(ordersTable, {
        fields: [driverTable.id],
        references: [ordersTable.driver_Id]
    })
}));
// Order has many Statuses (via OrderStatus)
export const orderStatusRelations = relations(ordersTable, ({ one, many }) => ({
    statuses: one(orderStatus, {
        fields: [ordersTable.id],
        references: [orderStatus.orderId]
    })
}));
// OrderMenuItem belongs to an Order
export const orderMenuItemOrderRelations = relations(ordersTable, ({ one }) => ({
    order: one(orderMenuItemTable, {
        fields: [ordersTable.id],
        references: [orderMenuItemTable.order_Id]
})
}));

// orderMenuItem
export const orderMenuItemTable = pgTable("order_menu_item", {
    id: serial("id").primaryKey(),
    order_Id: integer("order_id").notNull().references(() => ordersTable.id,  {onDelete:"cascade"}),
    menuItem_Id: integer("menuItem_Id").notNull().references(() => menuItemTable.id, {onDelete:"cascade"}),
    quantity: integer("quantity").notNull(),
    itemPrice: decimal("decimal").notNull(),
    price: decimal("decimal").notNull(),
    comment: text("comment")
});
// MenuItem has many OrderMenuItems
export const menuItemOrderMenuItemRelations = relations(menuItemTable, ({ one, many }) => ({
    orderMenuItems: one(orderMenuItemTable, {
    fields: [menuItemTable.id],
    references: [orderMenuItemTable.menuItem_Id]
    })
    }));

// statusCatalog
export const statusCatalogTable = pgTable("status_catalog", {
    id: serial("id").primaryKey(),
    name: varchar("name").notNull()
});

// StatusCatalog has many OrderStatuses
export const statusCatalogOrderStatusRelations = relations(statusCatalogTable, ({ one, many }) => ({
    orderStatuses: one(orderStatus, {
        fields: [statusCatalogTable.id],
        references: [orderStatus.statusCatalogId]
    })
}));

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
// userRestaurantOwnerRelations

export const userRestaurantOwnerRelations = relations(usersTable, ({ one,many}) => ({
    restaurantOwner: one(restaurantOwneTable, {
        fields: [usersTable.id],
        references: [restaurantOwneTable.ownerId]
    })
}));
// RestaurantOwner belongs to a Restaurant
export const restaurantOwnerRestaurantRelations = relations(restaurantOwneTable, ({ one }) => ({
    restaurant: one(restaurantTable, {
        fields: [restaurantOwneTable.restaurantId],
        references: [restaurantTable.id]
    })
}));


// RestaurantOwner belongs to an Owner (User)
export const restaurantOwnerUserRelations = relations(restaurantOwneTable, ({ one }) => ({
    owner: one(usersTable, {
        fields: [restaurantOwneTable.ownerId],
        references: [usersTable.id]
    })
}));



