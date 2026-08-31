import { useEffect, useState } from "react";
import { getProfile } from "../services/profileService";
import { formatError } from "../utils/errorUtils";

export default function Profile({ onLogout }) {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activity, setActivity] = useState({ reviews: 0, saved: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    const loadProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const profileData = await getProfile();

        if (!isCurrent) return;
        setUser(profileData?.user || {});
        setActivity(profileData?.activity || { reviews: 0, saved: 0 });
        setReviews(Array.isArray(profileData?.reviews) ? profileData.reviews : []);
      } catch (loadError) {
        if (isCurrent) setError(formatError(loadError));
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      isCurrent = false;
    };
  }, []);

  const profileName = user?.displayName || user?.name || user?.username || "";
  const initials = user?.initials || profileName.split(" ").map((part) => part[0]).join("").slice(0, 2) || "";

  const renderStars = (n) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg key={i} className={`h-4 w-4 ${i < n ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.377 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.372 2.472c-.785.57-1.84-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.64 9.393c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69L9.05 2.927z" />
        </svg>
      );
    }
    return <div className="flex items-center gap-1">{stars}</div>;
  };

  if (loading) {
    return <section className="px-8 py-10 text-center text-gray-600">Loading your profile...</section>;
  }

  if (error) {
    return (
      <section className="px-8 py-10">
        <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
          <p className="font-semibold">Unable to load your profile</p>
          <p className="mt-2 text-sm">{error.message}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-8 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
        {/* Left column: profile card + activity */}
        <div className="space-y-6">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full bg-linear-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-lg font-bold mb-4">
                {initials}
              </div>
              <h2 className="text-lg font-semibold">{profileName}</h2>
              <p className="text-sm text-gray-500 mt-1">{user.email || ""}</p>
              <p className="text-xs text-gray-400 mt-1">Member since {user.memberSince || ""}</p>
              <button className="mt-4 inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 010 2.828l-8.486 8.486a2 2 0 01-.708.414l-4 1a1 1 0 01-1.213-1.213l1-4a2 2 0 01.414-.708L14.586 2.586a2 2 0 012.828 0z"/></svg>
                Edit Profile
              </button>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold mb-4">Your Activity</h3>
            <div className="space-y-3">
              <div className="rounded-lg bg-emerald-50 p-4 flex items-center justify-between">
                <div className="text-sm text-emerald-700">Reviews</div>
                <div className="text-lg font-semibold">{activity.reviews}</div>
              </div>

              <div className="rounded-lg bg-purple-50 p-4 flex items-center justify-between">
                <div className="text-sm text-purple-700">Saved Products</div>
                <div className="text-lg font-semibold">{activity.saved}</div>
              </div>
            </div>

            <div className="mt-6">
              <button onClick={onLogout} className="w-full rounded-lg border px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">Logout</button>
            </div>
          </div>
        </div>

        {/* Right column: reviews */}
        <div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Your Reviews</h3>

            {reviews.length === 0 ? (
              <p className="rounded-xl bg-gray-50 px-5 py-6 text-sm text-gray-600">
                You have not added any reviews yet. Your product reviews will appear here.
              </p>
            ) : (
              <div className="space-y-6">
                {reviews.map((r) => (
                <div key={r.id} className="flex gap-4 items-start">
                  <img src={r.imageUrl || r.image || "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=60"} alt="" className="h-16 w-16 rounded-md object-cover" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{r.title || r.productName || "Product review"}</h4>
                        <p className="text-xs text-gray-500">{r.brand || r.company || ""}</p>
                      </div>
                      <div className="text-right text-xs text-gray-400">{r.time || ""}</div>
                    </div>

                    <div className="mt-2 flex items-center gap-3">
                      {renderStars(r.rating)}
                    </div>

                    <p className="text-sm text-gray-700 mt-3">{r.text || ""}</p>

                    <div className="mt-3 flex gap-2">
                      {(Array.isArray(r.tags) ? r.tags : []).map((t) => (
                        <span key={t} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
