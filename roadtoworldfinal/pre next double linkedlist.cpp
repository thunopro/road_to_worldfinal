#include<bits/stdc++.h>
using namespace std ; 
#define int long long
#define ll long long 
#define pb push_back 
#define fi first 
#define se second 
#define left id<<1
#define right id<<1|1 
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

int n; 
int a[maxn];  
int pre[maxn] , nxt[maxn]; 
set<pii> S; 
void erase_edge(int i) 
{
    if (i && nxt[i]) S.erase({a[i]&a[nxt[i]],i});
}
void add_edge(int i) 
{
    if (i && nxt[i]) S.insert({a[i]&a[nxt[i]],i});
}
signed main () 
{
    ios_base::sync_with_stdio(0); 
    cin.tie(0);cout.tie(0); 
    cin >> n; 
    for (int i = 1; i <= n; i ++) cin >> a[i]; 
    for (int i = 1; i <= n; i ++) 
    {
        pre[i] = i-1; 
        nxt[i] = (i == n ? 0 : i + 1); 
    }

    for (int i = 1; i < n; i++) add_edge(i); 

    int answer = 0; 
    while (!S.empty()) 
    {
        auto [w,i] = *S.rbegin(); 
        int j = nxt[i]; 
        answer += w; 
        erase_edge(pre[i]), erase_edge(i), erase_edge(j); 
        a[i] &= a[j]; 
        nxt[i] = nxt[j]; 
        if (nxt[i]) pre[nxt[i]] = i; 
        add_edge(pre[i]); 
        add_edge(i); 
    }
    cout << answer; 
    return 0;
}
