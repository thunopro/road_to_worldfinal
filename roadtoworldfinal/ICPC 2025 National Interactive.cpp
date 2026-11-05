#include<bits/stdc++.h>
using namespace std ; 
#define int long long
#define ll long long 
#define pb push_back 
#define fi first 
#define se second 
// #define left id<<1
// #define right id<<1|1 
#define re exit(0); 
#define _lower(x) lower_bound(v.begin(),v.end(),x)-v.begin()+1 
#define mid (l+r)/2
#define all(x) x.begin(),x.end()
#define TIME (1.0*clock() / CLOCKS_PER_SEC)
const int mod = 1e9+7;
const int INF = 1e9+2; 

typedef vector<int> vi; 
typedef pair<int,int> pii; 
typedef vector<pii> vii; 

template <typename T> void chkmin (T &a , T b) {if (a > b) a = b;} 
template <typename T> void chkmax (T &a , T b) {if (a < b) a = b;} 

void add (int &a , int b) 
{
    a += b; 
    if (a >= mod) a -= mod; 
    if (a < 0) a += mod; 
}


int _pow(int a, int n) 
{
    if (n == 0) return 1; 
    int res = _pow(a,n/2); 
    if (n % 2) return 1ll*res*res%mod*a%mod; 
    else return 1ll*res*res%mod; 
}
#define maxn 200009

int ask (vi l, vi r) 
{
    if (l.size() == 1 && r.size() == 1 && l[0] == r[0]) return 0; 
    cout << "? " << l.size() << " " << r.size() << endl; 
    for (auto x : l) cout << x << " "; cout << endl; 
    for (auto x : r) cout << x << " "; cout << endl; 
    char ch; cin >> ch; 
    if (ch == '<') return -1; 
    if (ch == '=') return 0; 
    return 1; 
}
int solve (vi a) 
{
    int m = a.size(); 
    if (m == 0) return 0; 
    if (m <= 3) 
    {
        int answer = 0; 
        for (auto x : a) if (ask({x},{1}) == 0) answer ++; 
        return answer; 
    }
    if (m&1) 
    {
        int last = a.back(); a.pop_back(); 
        return solve(a) + (ask({last},{1}) == 0); 
    }
    
    int half = m/2; 

    auto sign = [&] (int start)
    {
        vi left, right; 
        for (int i = 0; i < half; i ++) 
        {
            left.pb(a[(start+i)%m]); 
            right.pb(a[(start+half+i)%m]); 
        }
        return ask(left,right); 
    }; 

    auto get_half = [&](int start, int len) 
    {
        vi f; 
        for (int i = 0; i < len; i ++) f.pb(a[(start+i)%m]); 
        return f; 
    }; 

    int first = sign (0); 
    
    if (first == 0) return 2*solve(get_half(0,half)); 
    int l = 0, r = half; 
    while (r - l > 1) 
    {
        int cur = sign(mid); 
        if (cur == 0) return 2*solve(get_half(mid,half)); 
        if (cur == first) l = mid; else r = mid; 
    }
    return 2*solve(get_half(l+1,half-1)) + 1; 
}
signed main () 
{
    ios_base::sync_with_stdio(0); 
    cin.tie(0);cout.tie(0); 
    int test; cin >> test; 
    while (test--) 
    {
        int n; 
        cin >> n; 
        int N = 1<<n; 
        vi f; 
        for (int i = 1; i <= N; i ++) f.pb(i); 
        int same = solve(f); 
        cout << "! " << min(same,N-same) << endl; 
    }
    return 0;
}
