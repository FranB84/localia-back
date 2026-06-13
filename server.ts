import env from "./env";
import app from "./src/app";
// import created routes
// import userRoutes from './src/routes/userRoutes';
import authRoutes from "./src/routes/authRoutes";
import reviewsRoutes from "./src/routes/reviewsRoutes";

//use routes
// app.use('/api/users', userRoutes);

app.use("/auth", authRoutes);
app.use("/businesses", reviewsRoutes);
// app.use("/businesses", businessRoutes);
// app.use("/businesses", searchRoutes);   // /businesses/search y /categories van aquí

// app.use("/users",      favoritesRoutes);

app.use("/api", (_req, res) => {
	res.status(404).json({ message: "Endpoint not found" });
});

app.listen(env.PORT, () => {
	console.log(`Server running on port ${env.PORT}`);
});
